"use client";
import { useRouter } from "next/navigation";
import { useRef } from "react";

export default function Page({ params }) {
  const passwordRef = useRef(null);
  const passwordRepeatRef = useRef(null);
  const router = useRouter();

  const handleReset = async () => {
    try {
      if (passwordRef.current.value !== passwordRepeatRef.current.value) {
        alert("Passwords do not match");
        return;
      }
      if (passwordRef.current.value == "") {
        alert("Password cannot be empty");
        return;
      }

      const id = params.slug[0];
      const token = params.slug[1];
      console.log({ id, token });
      const res = await fetch(
        `/api/backendi/auth/reset_password/${id}/${token}`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            new_password: passwordRef.current.value,
          }),
        },
      );
      // if response is not ok, throw error
      if (!res.ok) throw new Error(res.statusText);
      else {
        router.push("/auth");
      }
    } catch (err) {
      alert(
        "Something went wrong in resetting password. Please contact the sys admin. The error is logged to the console.",
      );
      console.log(err);
    }
  };

  return (
    <div className="h-screen w-screen bg-black flex justify-center items-center">
      <div className="h-1/2 w-1/4 rounded-lg bg-[#1E1E21] flex flex-col justify-center items-center">
        <div className="flex flex-col justify-center items-center">
          <input
            ref={passwordRef}
            type="password"
            placeholder="Password"
            className="bg-[#252526] text-white p-3 outline-none border-b-white border-b-2 rounded-t-lg m-3"
          ></input>
          <input
            ref={passwordRepeatRef}
            type="password"
            placeholder="Re Enter Password"
            className="bg-[#252526] text-white p-3 outline-none border-b-white border-b-2 rounded-t-lg m-3"
          ></input>
          <button
            className="bg-[#252526] text-white p-3 rounded-lg m-3 border-2 border-[#252526] hover:border-white"
            onClick={handleReset}
          >
            Reset
          </button>
        </div>
      </div>
    </div>
  );
}
