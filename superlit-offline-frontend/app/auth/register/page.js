"use client";
import { useRouter } from "next/navigation";
import { useRef } from "react";
import { useAuth } from "@/components/AuthContext";

export default function Register({ children }) {
  const IdRef = useRef(null);
  const nameRef = useRef(null);
  const emailRef = useRef(null);
  const typeRef = useRef(null);
  const passwordRef = useRef(null);
  const passwordRepeatRef = useRef(null);
  const router = useRouter();
  const { user, login, logout } = useAuth();

  const handleRegister = async () => {
    if (
      !IdRef.current.value ||
      !passwordRef.current.value ||
      !passwordRef.current.value
    ) {
      alert("Please enter both SRN, password and repeat password");
      return;
    }
    try {
      // sends post request to /api/login with srn and password
      const res = await fetch("/api/backendi/auth/signup", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          type: typeRef.current.value,
          srn: IdRef.current.value,
          name: nameRef.current.value,
          email: emailRef.current.value,
          password: passwordRef.current.value,
        }),
      });
      // if response is not ok, throw error
      if (!res.ok) throw new Error(res.statusText);
      // get the json data
      const data = await res.json();
      console.log(data);
      if (data.success) {
        // if success is true, redirect to /test/0 (test with ID 0) (temporarily, would be /dashboard later)
        login(IdRef.current.value);
        router.push("/test/0");
      } else {
        // else something went wrong in register
        alert("Something screwed up. Check the browser console");
        console.log(res.statusText);
      }
    } catch (err) {
      console.log(res.statusText);
      alert(
        "Something went wrong in registering. Please contact the sys admin. The error is logged to the console.",
      );
      console.log(err);
    }
  };

  return (
    <div className="h-screen w-screen bg-black flex justify-center items-center">
      <div className="min-h-1/2 w-1/4 rounded-lg bg-[#1E1E21] flex flex-col justify-center items-center">
        <div className="flex flex-col justify-center items-center">
          <input
            ref={IdRef}
            type="text"
            placeholder="SRN/EMPID"
            onInput={(e) => {
              e.target.value = e.target.value.toUpperCase();
            }}
            className="bg-[#252526] text-white p-3 outline-none border-b-white border-b-2 rounded-t-lg m-3"
          ></input>
          <input
            ref={nameRef}
            type="text"
            placeholder="Name"
            onInput={(e) => {
              e.target.value = e.target.value.toUpperCase();
            }}
            className="bg-[#252526] text-white p-3 outline-none border-b-white border-b-2 rounded-t-lg m-3"
          ></input>
          <label className="text-white">
            <div className="px-2 inline">Who Dis?</div>
            <select
              name="type"
              ref={typeRef}
              defaultValue="student"
              className="bg-[#252526]"
            >
              <option value="student">Student</option>
              <option value="teacher">Teacher</option>
            </select>
          </label>
          <input
            ref={emailRef}
            type="text"
            placeholder="Email"
            onInput={(e) => {
              e.target.value = e.target.value.toUpperCase();
            }}
            className="bg-[#252526] text-white p-3 outline-none border-b-white border-b-2 rounded-t-lg m-3"
          ></input>
          <input
            ref={passwordRef}
            type="password"
            placeholder="Password"
            className="bg-[#252526] text-white p-3 outline-none border-b-white border-b-2 rounded-t-lg m-3"
          ></input>
          <input
            ref={passwordRepeatRef}
            type="password"
            placeholder="Repeat Password"
            className="bg-[#252526] text-white p-3 outline-none border-b-white border-b-2 rounded-t-lg m-3"
          ></input>
          <button
            className="bg-[#252526] text-white p-3 rounded-lg m-3 border-2 border-[#252526] hover:border-white"
            onClick={handleRegister}
          >
            Login
          </button>
        </div>
      </div>
    </div>
  );
}
