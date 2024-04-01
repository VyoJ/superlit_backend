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

import { motion } from "framer-motion";
import React from "react";
import { AuroraBackground } from "@/components/Spotlight";

export default function AuroraBackgroundDemo() {
  return (
    <AuroraBackground>
      <motion.div
        initial={{ opacity: 0.0, y: 40 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{
          delay: 0.3,
          duration: 0.8,
          ease: "easeInOut",
        }}
        className="relative flex flex-col gap-4 items-center justify-center px-4"
      >
        <div className="text-3xl md:text-7xl font-bold dark:text-white text-center">
          Background lights are cool you know.
        </div>
        <div className="font-extralight text-base md:text-4xl dark:text-neutral-200 py-4">
          And this, is chemical burn.
        </div>
        <a
          href="/auth"
          className="no-underline flex justify-center align-center"
        >
          <button className="bg-black dark:bg-white rounded-full w-fit text-white dark:text-black px-4 py-2">
            Debug now
          </button>
        </a>
      </motion.div>
    </AuroraBackground>
  );
}
