export default function ViewClassroom(){
return (
  <div className="classroom">
    { // make navbar
    }
    <div className="m-6 p-5">Add Classroom </div>
    <div className="grid grid-cols-3 m-2 p-2 rounded-xl justify-center items-center">
      <div className="flex flex-col justify-center items-center border border-white p-5 m-6 text-2xl">Class1<div className=" text-lg">Assignment Set: </div><div className=" text-lg">Due On: </div><div className=" text-lg">No. of submissions: </div></div>
      <div className="flex flex-col justify-center items-center border border-white p-5 m-6 text-2xl">Class2 <div className=" text-lg">Assignment Set: </div><div className=" text-lg">Due On: </div><div className=" text-lg">No. of submissions: </div></div>
      <div className="flex flex-col justify-center items-center border border-white p-5 m-6 text-2xl">Class3 <div className=" text-lg">Assignment Set: </div><div className=" text-lg">Due On: </div><div className=" text-lg">No. of submissions: </div></div>
    </div>
  </div>
);
}
