"use client";
import React, { useState } from 'react';


const QuestionForm = () => {
  const [teacherId, setteacherId] = useState('');
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [questions, setQuestions] = useState([]);

  const addQuestion = () => {
    setQuestions([...questions, { question: '', defaultCode: '', example_input: '', example_output: '', test_cases: [] }]);
  };

  const removeQuestion = (index) => {
    setQuestions(questions.filter((_, i) => i !== index));
  };

  const addTestCase = (questionIndex) => {
    const newTestCases = [...questions[questionIndex].test_cases, { input: '', expected_output: '' }];
    const updatedQuestions = questions.map((q, i) => i === questionIndex ? { ...q, test_cases: newTestCases } : q);
    setQuestions(updatedQuestions);
  };

  const removeTestCase = (questionIndex, testCaseIndex) => {
    const newTestCases = questions[questionIndex].test_cases.filter((_, i) => i !== testCaseIndex);
    const updatedQuestions = questions.map((q, i) => i === questionIndex ? { ...q, test_cases: newTestCases } : q);
    setQuestions(updatedQuestions);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const output = {
      classId: 1,
      teacherId: Number(teacherId),
      startDate,
      endDate,
      questions: questions.map((q, index) => ({
        question_id: index,
        ...q,
      })),
    };
    let jsonString = JSON.stringify(output, null, 2);
    console.log(jsonString);

    let response = await fetch("/api/backendi/test/create_test", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: jsonString
    });

    response = await response.json();

    alert(`Here's your test ID: ${response._id}`);




    // The below code downloads the JSON generated to the client' laptop
    // const blob = new Blob([jsonString], { type: 'application/json' });
    //
    // // Create an anchor element and trigger a download
    // const a = document.createElement('a');
    // a.download = 'output.json'; // Name of the downloaded file
    // a.href = window.URL.createObjectURL(blob);
    // const clickEvt = new MouseEvent('click', {
    //   view: window,
    //   bubbles: true,
    //   cancelable: true,
    // });
    // a.dispatchEvent(clickEvt);
    // a.remove();
  };

  return (
    <div className="bg-black min-h-screen">
      <form onSubmit={handleSubmit} className="flex flex-col items-center mx-10">
        <input
          type="number"
          placeholder="EMP ID"
          value={teacherId}
          onChange={(e) => setteacherId(e.target.value)}
          className="bg-[#252526] text-white p-3 outline-none border-b-white border-b-2 rounded-t-lg m-3 w-full"
        />
        <input
          type="datetime-local"
          placeholder="Start Time"
          value={startDate}
          onChange={(e) => setStartDate(e.target.value)}
          className="bg-[#252526] text-white p-3 outline-none border-b-white border-b-2 rounded-t-lg m-3 w-full"
        />
        <input
          type="datetime-local"
          placeholder="Start Time"
          value={endDate}
          onChange={(e) => setEndDate(e.target.value)}
          className="bg-[#252526] text-white p-3 outline-none border-b-white border-b-2 rounded-t-lg m-3 w-full"
        />
        {questions.map((q, questionIndex) => (
          <div key={questionIndex} className="w-full prose prose-invert">
            <h3>Question {questionIndex}</h3>
            <input
              type="text"
              placeholder="Question"
              value={q.question}
              onChange={(e) => setQuestions(questions.map((q, i) => i === questionIndex ? { ...q, question: e.target.value } : q))}
              className="bg-[#252526] text-white p-3 outline-none border-b-white border-b-2 rounded-t-lg m-3 w-full"
            />
            <textarea
              placeholder="Default Code"
              value={q.defaultCode}
              onChange={(e) => setQuestions(questions.map((q, i) => i === questionIndex ? { ...q, defaultCode: e.target.value } : q))}
              className="bg-[#252526] text-white p-3 outline-none border-b-white border-b-2 rounded-t-lg m-3 w-full"
            />
            <input
              type="text"
              placeholder="Example Input"
              value={q.example_input}
              onChange={(e) => setQuestions(questions.map((q, i) => i === questionIndex ? { ...q, example_input: e.target.value } : q))}
              className="bg-[#252526] text-white p-3 outline-none border-b-white border-b-2 rounded-t-lg m-3 w-full"
            />
            <input
              type="text"
              placeholder="Example Output"
              value={q.example_output}
              onChange={(e) => setQuestions(questions.map((q, i) => i === questionIndex ? { ...q, example_output: e.target.value } : q))}
              className="bg-[#252526] text-white p-3 outline-none border-b-white border-b-2 rounded-t-lg m-3 w-full"
            />
            {q.test_cases.map((tc, testCaseIndex) => (
              <div key={testCaseIndex} className="w-full">
                <input
                  type="text"
                  placeholder="Test Case Input"
                  value={tc.input}
                  onChange={(e) => setQuestions(questions.map((q, i) => i === questionIndex ? { ...q, test_cases: q.test_cases.map((tc, j) => j === testCaseIndex ? { ...tc, input: e.target.value } : tc) } : q))}
                  className="bg-[#252526] text-white p-3 outline-none border-b-white border-b-2 rounded-t-lg m-3 w-full"
                />
                <input
                  type="text"
                  placeholder="Expected Output"
                  value={tc.expected_output}
                  onChange={(e) => setQuestions(questions.map((q, i) => i === questionIndex ? { ...q, test_cases: q.test_cases.map((tc, j) => j === testCaseIndex ? { ...tc, expected_output: e.target.value } : tc) } : q))}
                  className="bg-[#252526] text-white p-3 outline-none border-b-white border-b-2 rounded-t-lg m-3 w-full"
                />
                <button type="button" onClick={() => removeTestCase(questionIndex, testCaseIndex)} className="m-5 bg-red-500 hover:bg-red-700 text-white font-bold py-2 px-4 rounded">Remove Test Case</button>
              </div>
            ))}
            <button type="button" onClick={() => addTestCase(questionIndex)} className="m-5 bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded">Add Test Case</button>
            <button type="button" onClick={() => removeQuestion(questionIndex)} className="m-5 bg-red-500 hover:bg-red-700 text-white font-bold py-2 px-4 rounded">Remove Question</button>
          </div>
        ))}
        <button type="button" onClick={addQuestion} className="m-5 bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded">Add Question</button>
        <button type="submit" className="m-5 bg-green-500 hover:bg-green-700 text-white font-bold py-2 px-4 rounded">Submit</button>
      </form>
    </div >
  );
};

export default QuestionForm;
