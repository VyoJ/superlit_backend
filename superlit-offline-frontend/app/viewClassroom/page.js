"use client"
import React, { useState, useRef, useEffect } from 'react';
import Modal from 'react-modal';
import './style.css';

export default function ViewClassroom() {
 var classArray = [["3-A","Week-2","28-Jan-2024","02-Feb-2024","xdgDesktop"],["3-B","Week-4","28-Jan-2024","02-Feb-2024","meRandomized"]];
 const [semesterNo, setSemesterNo] = useState('');
 const [section, setSection] = useState('');
 const [subject, setSubject] = useState('');
 const [showModal, setShowModal] = useState(false);

 const modalRef = useRef();

 useEffect(() => {
    function handleClickOutside(event) {
      if (modalRef.current && !modalRef.current.contains(event.target)) {
        setShowModal(false);
      }
    }

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
 }, []);

 const handleSubmit = (event) => {
    event.preventDefault();
    console.log({ semesterNo, section, subject });
    setSemesterNo('');
    setSection('');
    setSubject('');
    setShowModal(false); // Close the modal after submission
 };

 return (
 <div>
 <div className="container">
        <div className="lg:text-6xl md:text-4xl text-3xl m-12">Your Classrooms</div>
        <div className=" grid lg:grid-cols-3 md:grid-cols-2 gap-12 z-0">
          {classArray.map((classItem, index) => (
            <div key={index}>
              <div className="card">
                <div className="border"></div>
                <div className="filter"></div>
                <div className="text-4xl">{classItem[0]}</div>
                <div className="text-2xl m-3">{classItem[1]}</div>
                <div>Assigned On: {classItem[2]}</div>
                <div>Due on: {classItem[3]}</div>
                <div>Code: {classItem[4]}</div> {/*need to disply the random gen code here */}
                <div className="shadow"></div>
                <div className="backdrop"></div>
              </div>
            </div>
          ))}
          <div className="addClassroom"onClick={() => setShowModal((prevShowModal) => !prevShowModal)}>
              <div className="card">
                <div className="border"></div>
                <div className="filter"></div>
                <div className="text-6xl">+</div>
                <div className="shadow"></div>
                <div className="backdrop"></div>
              </div>
          </div>
      </div> 
      </div>
   <Modal isOpen={showModal} ariaHideApp={false} className="bg-background grid lg:m-24 justify-items-center overflow-hidden " >
   <div ref={modalRef}>
        <form onSubmit={handleSubmit} >
          <label className="m-4  flex ">
            Semester No:
            <input
              type="number"
              value={semesterNo}
              onChange={e => setSemesterNo(e.target.value)}
            />
          </label>
          <label className="m-6 flex">
            Section:
            <input
              type="text"
              value={section}
              onChange={e => setSection(e.target.value)}
            />
          </label>
          <label className="m-6 flex">
            Subject:
            <input
              type="text"
              value={subject}
              onChange={e => setSubject(e.target.value)}
            />
          </label><label className="m-6 flex">
            Code to add students:{}  {/*get random code from backend*/}        
          </label>

          <button type="submit" onClick={()=> setShowModal(false)} className="  m-6 ">Submit</button>
        </form>
   </div>
      </Modal>
<div className="circle one"></div>
<div className="circle two"></div>
<svg>
  <filter id='noiseFilter'>
    <feTurbulence 
      type='fractalNoise' 
      baseFrequency='0.6' 
      stitchTiles='stitch'/>
  </filter>
</svg>
</div>
  );
}

