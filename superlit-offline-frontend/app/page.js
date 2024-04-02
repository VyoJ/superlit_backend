// "use client";

// export default function Home() {
//   return (
//     <div className="bg-black h-screen flex justify-center items-center flex-col">
//       <div className="bg-black rounded-lg box-border p-5 h-full w-full">
//         <div className="rounded-lg bg-[#1E1E21] h-full w-full p-10 flex flex-col">
//           <h1 className="text-4xl font-bold">What Is Superlit?</h1>
//           <div className="text-xl mt-6">
//             Superlit is a replacement to sublit using newer technologies and
//             developed by first years of PES University!
//           </div>
//           <div className="text-xl mt-6">
//             This tool is currently under development and will be here soon!
//             Meanwhile check out our editor:{" "}
//           </div>
//           <a
//             href="/auth"
//             className="no-underline flex justify-center align-center"
//           >
//             <button className="text-3xl mt-10 bg-[#252526] p-10 hover:text-4xl transition-all ease-in-out rounded-lg">
//               Go To Editor
//             </button>
//           </a>
//         </div>
//       </div>
//     </div>
//   );
// }

"use client";

import React from "react";
import { motion } from "framer-motion";
import { LampContainer } from "@/components/Lamp";

export default function Home() {
  return (
    <LampContainer>
      <motion.h1
        initial={{ opacity: 0.5, y: 100 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{
          delay: 0.3,
          duration: 0.8,
          ease: "easeInOut",
        }}
        className="mt-8 bg-gradient-to-br from-slate-300 to-slate-500 py-4 bg-clip-text text-center text-2xl font-medium tracking-tight text-transparent md:text-4xl"
      >
        Superlit is a replacement to Sublit using <br /> newer technologies and
        developed by <br /> second years of PES University!
        <a
          href="/auth"
          className="no-underline flex justify-center align-center"
        >
          <button className="text-xl mt-10 border-2 text-white border-white p-10 hover:text-2xl transition-all ease-in-out rounded-xl">
            Go To Editor
          </button>
        </a>
      </motion.h1>
    </LampContainer>
  );
}