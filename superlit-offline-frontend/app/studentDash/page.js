"use client";
import "./style.css";
import Modal from "react-modal";
import React, { useState, useRef, useEffect } from "react";
import Link from "next/link";
import { useAuth } from "@/components/AuthContext";
export default function sdashboard() {
  // var dashboardOptions = [
  //   ["Classroom1", "2", "0", "15/15"],
  //   ["Classroom2", "5", "1", "15/15"],
  // ]; // ["classroom_name", "no of completed assignments", "no of due assignments", "score"]
  let [dashboardOptions, setdashBoardOptions] = useState([]);
  let { user, login, logout } = useAuth();

  const [showModal, setShowModal] = useState(false);
  const [code, setCode] = useState("");

  const modalRef = useRef();

  useEffect(async () => {
    // TODO: add an if(user not defined) , go to auth stuff here.

    // nice backend fetch
    const response = await fetch("/api/backendi/class/get_student_class/" + user);
    setdashBoardOptions(await response.json());


    // frontend modal bull, god knows how it works
    function handleClickOutside(event) {
      if (modalRef.current && !modalRef.current.contains(event.target)) {
        setShowModal(false);
      }
    }

    document.addEventListener("mousedown", handleClickOutside);


    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };


  }, []);

  const handleOpenModal = () => {
    setShowModal(true);
  };

  const handleCloseModal = () => {
    setShowModal(false);
  };

  const handleSubmitModal = async () => {
    let body = {
      class_id: code,
      student_id: user["_id"],
    }


    const res = await fetch("/api/backendi/class/add_to_class", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(body),
    }
    );

    if (!res.ok) {
      alert(await res.text());
    } else {
      alert("You've been added to the classroom");
    }
  }

  const currentHour = new Date().getHours();
  var greeting;
  if (currentHour < 12) {
    greeting = "Good Morning";
  } else if (currentHour < 18) {
    greeting = "Good Afternoon";
  } else {
    greeting = "Good Evening";
  }
  return (
    <div>
      <div className="text-4xl flex justify-center items-center m-12 lg:mb-24 ">
        Hello! {greeting}
      </div>
      <div className="wrapper"></div>
      <div className=" grid lg:grid-cols-3 md:grid-cols-2 gap-12 z-0">
        {dashboardOptions.map((dashboardItem, index) => (
          <div key={index}>
            <div className="card h-96 w-96">
              <div className="border"></div>
              <div className="filter"></div>
              <div className="text-4xl mb-4">{dashboardItem[0]}</div>
              <div className="flex flex-col content-start">
                <div className=" m-1">
                  Completed Assignments: {dashboardItem[1]}
                </div>
                <div className=" m-1">Due Assignments: {dashboardItem[2]}</div>
                <div className="text-white mt-6">Click to see scores</div>
              </div>
              <div className="shadow"></div>
              <div className="backdrop"></div>
            </div>
          </div>
        ))}
        <div className="joinClassroom z-0" onClick={handleOpenModal}>
          <div className="card h-96 w-96">
            <div className="border"></div>
            <div className="filter"></div>
            <div className="text-6xl">+</div>
            <div className="shadow"></div>
            <div className="backdrop"></div>
          </div>
        </div>
      </div>
      <Modal
        isOpen={showModal}
        onRequestClose={handleCloseModal}
        ariaHideApp={false}
        className="bg-background grid lg:m-24 justify-items-center overflow-hidden z-10"
      >
        <div ref={modalRef}>
          <label className="mt-2 mb-2 flex">
            Enter your code:
            <input
              type="text"
              value={code}
              onChange={(e) => setCode(e.target.value)}
            />
          </label>
          <button className="m-6" onClick={handleSubmitModal}>
            Submit
          </button>
        </div>
      </Modal>
      <div className="circle one"></div>
      <div className="circle two"></div>
      <svg>
        <filter id="noiseFilter">
          <feTurbulence
            type="fractalNoise"
            baseFrequency="0.6"
            stitchTiles="stitch"
          />
        </filter>
      </svg>
    </div>
  );
}
