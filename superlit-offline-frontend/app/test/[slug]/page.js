"use client";
import Image from "next/image";
import Switch from "react-switch";
import { useEffect, useRef } from "react";
import { useState } from "react";
import axios from "axios";
import dynamic from "next/dynamic";
import { useRouter } from "next/navigation";
import { useAuth } from "@/components/AuthContext";

import { loader } from "@monaco-editor/react";
import Editor from "@monaco-editor/react";
import { initVimMode } from "monaco-vim";

export default function Test({ params }) {
  const editorRef = useRef(null);
  const inputRef = useRef(null);
  const outputRef = useRef(null);
  const editor_vim_statusbar = useRef(null);
  const [questionNumber, setQuestionNumber] = useState(0);
  const [vimMode, setVimMode] = useState(false);

  const router = useRouter();
  const { user, login, logout } = useAuth();
  const [loading, setLoading] = useState(true);
  // stuff that should run only once on page load
  useEffect(() => {
    if (!user) router.replace("/auth");
    const monaco = dynamic(
      import("monaco-editor").then((monaco) => {
        console.log("monaco loaded");
        console.log(monaco);
        loader.config({ monaco });
        setLoading(false);
        return monaco;
      }),
      { ssr: false }
    );
  }, []);

  const test_id = params.slug;
  console.log(test_id);

  const [testData, setTestData] = useState(null);
  const [editorData, setEditorData] = useState([]);

  // now we need to send this test_id to the server to fetch test details
  async function fetch_test_data() {
    try {
      const res = await fetch("/api/backendi/get_test_data/" + test_id);
      const data = await res.json();
      console.log(data);
      setTestData(data);
      const editorData = data.questions.map((question) => {
        return question.defaultCode;
      });
      setEditorData(editorData);
    } catch (e) {
      alert(
        "Something went wrong. Contact the sys admin. The error has been logged to the console"
      );
      console.log(e);
    }
  }
  useEffect(() => {
    fetch_test_data();
  }, []);

  function handleEditorDidMount(editor, monaco) {
    editorRef.current = editor;
  }

  function run_button_clicked() {
    const editorValue = editorRef.current.getValue();
    const inputValue = inputRef.current.value;
    const post_request_data = {
      srn: user,
      code: editorValue,
      input: inputValue,
    };

    console.log(editorValue);
    console.log(inputValue);

    axios
      .post("/api/backendi/run", post_request_data, {
        headers: {
          "Access-Control-Allow-Origin": "*",
          "Content-Type": "application/json",
        },
      })
      .then((response) => {
        console.log("Compiler post request successful");
        console.log(response.data);
        const output_screen = outputRef.current;
        output_screen.value = response.data;
      })
      .catch((error) => {
        console.log("Compiler post request screwed up", error);
      });
  }

  function submit_button_clicked() {
    const editorValue = editorRef.current.getValue();
    const post_request_data = {
      srn: user,
      code: editorValue,
      test_cases: testData.questions[questionNumber].test_cases,
    };
    console.log(post_request_data);
    // expected json response:
    // {
    //   "all_passed": true,
    //   "test_case_failed": {
    //
    //   },
    // }
    //
    //
    // If any test case fails:
    // {
    //   "all_passed": false,
    //   "test_case_failed": {
    //        "input": `4`,
    //        "expected_output": `Hello Superlit!
    //         4`,
    //         "produced_output": `Unga Bunga`
    //   },
    // }

    axios
      .post("/api/backendi/submit", post_request_data, {
        headers: {
          "Access-Control-Allow-Origin": "*",
          "Content-Type": "application/json",
        },
      })
      .then((response) => {
        const response_json = response.data;
        console.log(response_json);
        if (response_json.all_passed) {
          alert("All test cases have passed!");
        } else {
          console.log("test case failed");
          const failed_case = response_json.test_case_failed;
          alert(
            `Test case failed!\nInput:\n${failed_case.input}\n\n\nExpected output:\n${failed_case.expected_output}\n\n\nProduced output:\n${failed_case.produced_output}`
          );
        }
      })
      .catch((error) => {
        console.log("Compiler post request screwed up", error);
      });
  }

  function saveEditorData(value, event) {
    setEditorData((editorData) => {
      editorData[questionNumber] = value;
      return editorData;
    });
  }

  async function end_button_clicked() {
    let post_request_data = {
      test_id: test_id,
      srn: user,
      editorData: editorData,
    };
    console.log(post_request_data);
    try {
      await fetch("/api/backendi/end_test", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(post_request_data),
      });
      alert("Test submitted successfully");
      router.replace("/auth");
    } catch (e) {
      alert(
        "Something went wrong. Contact the sys admin. The error has been logged to the console"
      );
      console.log(e);
    }
  }

  const goToNextQuestion = () => {
    setQuestionNumber((qNum) => {
      if (qNum == testData.questions.length - 1) {
        return qNum;
      } else {
        return qNum + 1;
      }
    });
  };

  const goToPrevQuestion = () => {
    setQuestionNumber((qNum) => {
      if (qNum == 0) {
        return qNum;
      } else {
        return qNum - 1;
      }
    });
  };

  const handleVimModeClick = (nextChecked) => {
    if (nextChecked) {
      let answer = prompt(
        "Vim Mode is an advance editing mode meant only for users who know Vim key bindings. If you don't know these key bindings, then the editor might appear to freeze and not respond to you, when in reality, it's in the Vim Mode. So do you really have what it takes to enable Vim Mode? Enter the Vim command to exit vim: "
      );
      if (answer == ":q") {
        setVimMode(
          initVimMode(editorRef.current, editor_vim_statusbar.current)
        );
        alert("Welcome, Chad. Vim mode enabled");
      } else if (!answer) {
        // prompt was cancelled
        alert("You were so close to greatness in life");
      } else {
        alert(
          "Nope :( That's not the right answer. You sure you know what you're doing?"
        );
      }
    } else {
      vimMode.dispose();
      setVimMode(null);
    }
  };

  if (!user || !testData || loading)
    return (
      <div className="flex justify-center items-center h-screen">
        loading...
      </div>
    );
  return (
    <div>
      <div className="w-screen p-3 bg-black flex justify-between items-center">
        <div>Superlit</div>
        <div className="vim-mode-switch flex">
          <div className="p-2">Vim Mode</div>
          <Switch
            onChange={handleVimModeClick}
            checked={vimMode}
            className="react-switch m-2"
          />
        </div>
      </div>
      <div className="flex flex-row scrollbar-hide bg-[#1E1E21]">
        <div className="bg-[#1E1E21] text-white mt-5 mb-5 ml-5 p-5 min-h-[90vh] rounded-lg flex flex-col w-1/3">
          <div className="text-white text-2xl pr-5 flex flex-row">
            <div
              onClick={goToPrevQuestion}
              className="pr-2 pl-2 cursor-pointer select-none"
            >
              {" "}
              &lt;{" "}
            </div>
            QUESTION {questionNumber}
            <div
              onClick={goToNextQuestion}
              className="pr-2 pl-2 cursor-pointer select-none"
            >
              {" "}
              &gt;{" "}
            </div>
          </div>
          <textarea
            disabled
            className="text-white p-2 bg-[#252526] rounded-lg outline-none resize-none h-full scrollbar-hide"
            value={testData.questions[questionNumber].question}
          ></textarea>

          <h2 className="text-white text-2xl pt-2 pr-5">EXAMPLE</h2>
          <h3 className="text-white text-xl pr-2 pl-2">INPUT</h3>
          <textarea
            disabled
            className="text-white p-2 bg-[#252526] rounded-lg outline-none resize-none h-1/4 scrollbar-hide"
            value={testData.questions[questionNumber].example_input}
          ></textarea>
          <h3 className="text-white text-xl pt-2 pl-2 pr-2">OUTPUT</h3>
          <textarea
            disabled
            className="text-white p-2 bg-[#252526] rounded-lg outline-none resize-none h-1/4 scrollbar-hide"
            value={testData.questions[questionNumber].example_output}
          ></textarea>
        </div>

        <div className="editor_output_wrapper flex flex-col w-full">
          <Editor
            height="70vh"
            theme="vs-dark"
            defaultLanguage="c"
            value={testData.questions[questionNumber].defaultCode}
            automaticLayout="true"
            className="m-5 pt-5 pb-5 bg-[#1E1E21] rounded-lg"
            onMount={handleEditorDidMount}
            onChange={saveEditorData}
          />
          <div
            className="editor-vim-statusbar"
            ref={editor_vim_statusbar}
          ></div>
          <div className="input_output_wrapper flex">
            <div className="input bg-[#1E1E21] text-white ml-5 h-[17vh] w-1/2 flex flex-col rounded-lg border-2 border-[#1E1E21]">
              <div className="input_heading text-base text-bold bg-[#1E1E21] rounded-t-lg pl-2">
                INPUT:
              </div>
              <textarea
                className="code_input h-full w-full rounded-b-lg bg-[#252526] text-white outline-none resize-none pb-2 pl-2 pr-2"
                defaultValue={testData.questions[questionNumber].example_input}
                ref={inputRef}
              ></textarea>
            </div>
            <div className="flex flex-col justify-center items-center">
              <button
                className="text-white z-10 pl-5 pr-5 flex flex-col rounded-lg text-xl justify-center items-center"
                onClick={run_button_clicked}
              >
                <div className="flex justify-center items-center">
                  <Image
                    src="/run_button.png"
                    alt="run"
                    height={25}
                    width={25}
                  />
                </div>
                <div className="text-gray text-sm pt-2">RUN</div>
              </button>

              <button
                className="text-white z-10 pl-5 pr-5 flex flex-col rounded-lg text-xl justify-center items-center mt-5"
                onClick={submit_button_clicked}
              >
                <div className="text-gray text-sm pt-2">SUBMIT QUESTION</div>
              </button>

              <button
                className="text-red-200 z-10 pl-2 pr-2 flex flex-col rounded-lg text-xl justify-center items-center mt-5"
                onClick={end_button_clicked}
              >
                <div className="text-gray text-sm pt-2">END TEST</div>
              </button>
            </div>
            <div className="output bg-[#1E1E21] text-white mr-5 h-[17vh] w-1/2 flex flex-col rounded-lg border-2 border-[#1E1E21]">
              <div className="output_heading text-base text-bold bg-[#1E1E21] rounded-t-lg pl-2">
                OUTPUT:
              </div>
              <textarea
                disabled
                className="code_output h-full w-full rounded-b-lg bg-[#252526] text-white p-2 outline-none resize-none read-only"
                ref={outputRef}
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
