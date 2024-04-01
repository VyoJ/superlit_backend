"use client";
import "./style.css";
import React, { useEffect } from 'react';
import { useAuth } from "@/components/AuthContext";

const AssignmentScores = () => {
 // Sample data for assignments and scores
 let { user, login, logout } = useAuth();
//  const assignments = [
//     { name: 'Math Test', score: 85 },
//     { name: 'English Essay', score: 90 },
//     { name: 'Science Quiz', score: 78 },
//  ];

let [assignments, setAssignments] = useState([]);
  useEffect(async () => {
    let assignments_fetched = await fetch("/api/backendi/test/completed_tests" + user["_id"]);
    setAssignments(assignments_fetched);
  })
  

 return (
    <div>
      <div className="text-4xl flex justify-center items-center m-12 lg:mb-24 ">Your Scores</div>
      <div className="grid grid-col gap-12 mt-12">
        {assignments.map((assignment, index) => (
          <div key={index} className="card">
            <div className="border"></div>
            <div className="filter"></div>
            <div className="flex flex-col content-start text-2xl">
              <div className="text-4xl mb-4">{assignment.name}</div>
              <div>Score: {assignment.score}</div>
            </div>
            <div className="backdrop"></div>
          </div>
        ))}
      </div>
    </div>
 );
};
export default AssignmentScores;