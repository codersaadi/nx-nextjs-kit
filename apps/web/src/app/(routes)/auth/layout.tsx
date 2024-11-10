// 'use client'
// import authImage from '@web/assets/images/bg-auth.jpg'
// import Image from 'next/image'
import type React from 'react';
// import { useState } from 'react'
const AuthLayout = ({ children }: { children: React.ReactNode }) => {
  return (
    <div className="flex items-center justify-center   h-screen  w-full   ">
      <div className="w-full py-2  flex-1 flex relative flex-col   items-center mt-2 mx-auto  md:mt-0   ">
        <div className="bg-white dark:bg-neutral-800/50 md:bg-transparent dark:md:bg-transparent backdrop-blur-lg md:backdrop-blur-0   p-4  rounded-xl h-full w-full relative max-w-md ">
          {children}
        </div>
      </div>
      {/* <AuthLayoutImage /> */}
    </div>
  );
};

export default AuthLayout;

// function AuthLayoutImage() {
//   const [loading, setLoading] = useState(true)
//   return (
//     <div
//       className={`fixed left-0  top-0 rounded-lg brightness-[8%] md:brightness-90 md:relative bg-cover  md:flex justify-center items-center  bg-center w-full md:flex-1 overflow-hidden  brightness-70   h-screen   -z-10  ${
//         loading && 'bg-gradient-to-r from-violet-400 to-primary '
//       } `}
//     >
//       <Image
//         src={authImage}
//         width={700}
//         height={800}
//         alt="moon-3d-image-cartoon"
//         onLoad={() => setLoading(false)}
//         quality={75}
//         className={`w-full grayscale h-full rounded-lg object-cover ${
//           loading && 'blur'
//         }`}
//       />
//     </div>
//   )
// }
