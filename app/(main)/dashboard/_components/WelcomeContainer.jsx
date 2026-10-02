"use client";

import { useUser } from "@clerk/nextjs";
import Image from "next/image";
import React from "react";

function WelcomeContainer() {
  const { user } = useUser();

  return (
   <div className="bg-[#D0F0FD] p-5 rounded-xl flex justify-between items-center mt-1">



      <div>
        <h2 className="text-lg font-bold">
          Welcome Back, {user?.fullName || user?.firstName || "User"}!
        </h2>
        <p className="text-gray-500">
          AI-Driven Interviews, Hassle-Free Hiring
        </p>
      </div>

      {user?.imageUrl && (
        <div className="mt-1">
          <Image
            src={user.imageUrl}
            alt="User Avatar"
            width={40}
            height={40}
            className="rounded-full"
          />
        </div>
      )}
    </div>
  );
}

export default WelcomeContainer;
