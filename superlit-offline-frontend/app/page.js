"use client";

export default function Home() {
  return (
    <div className="bg-black h-screen flex justify-center items-center flex-col">
      <div className="bg-black rounded-lg box-border p-5 h-full w-full">
        <div className="rounded-lg bg-[#1E1E21] h-full w-full p-10 flex flex-col">
          <h1 className="text-4xl font-bold">What Is Superlit?</h1>
          <div className="text-xl mt-6">
            Superlit is a replacement to sublit using newer technologies and
            developed by first years of PES University!
          </div>
          <div className="text-xl mt-6">
            This tool is currently under development and will be here soon!
            Meanwhile check out our editor:{" "}
          </div>
          <a
            href="/auth"
            className="no-underline flex justify-center align-center"
          >
            <button className="text-3xl mt-10 bg-[#252526] p-10 hover:text-4xl transition-all ease-in-out rounded-lg">
              Go To Editor
            </button>
          </a>
        </div>
      </div>
    </div>
  );
}
