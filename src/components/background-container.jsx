"use client";
import React from "react";
import * as Recharts from "recharts";
import * as ShadcnUI from "@/design-libraries/shadcn-ui";

function BackgroundContainer({ children }) {
  return <div className="bg-[#0a0f23] min-h-screen">{children}</div>;
}

function BackgroundContainerStory() {
  return (
    <div>
      <BackgroundContainer>
        <div className="text-white font-roboto text-center p-10">
          Main Content goes here
        </div>
      </BackgroundContainer>
    </div>
  );
}

export default BackgroundContainer;