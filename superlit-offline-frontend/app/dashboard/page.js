"use client";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useAuth } from "@/components/AuthContext";
import { useRouter } from "next/navigation";
import { useEffect } from "react";

export default function Dashboard() {
  const { user, login, logout } = useAuth();
  const router = useRouter();
  console.log(user);
  // useEffect(() => {
  //   if (!user) {
  //     router.replace("/auth");
  //   }
  // }, []);
  // we gotta figure out a way to determine user type
  const user_type = "teacher";
  // if (!user)
  //   return (
  //     <div className="flex justify-center items-center h-screen">
  //       Loading...
  //     </div>
  //   );
  return (
    <div>
      {user_type === "teacher" ? (
        <div className="h-screen w-screen bg-black grid-cols-4">
          <div className="card md:ml-10 md:mr-10 ml-5 mr-5 rounded-lg text-center inline-block bg-[#1E1E21] p-8">
            <div className="flex justify-center">
              <FontAwesomeIcon icon="fa-regular fa-instagram" />
            </div>

            <div className="card-content">
              <h1 className="pr-10 pl-10">Classrooms</h1>
            </div>
          </div>
        </div>
      ) : (
        <div>Student Home Page</div>
      )}
    </div>
  );
}
