"use client";
import React from "react";

function CrdsExchangeLink({ href }) {
  const linkClass =
    "text-white hover:text-[#f7b32b] text-[min(5vh,16px)] hidden md:inline-block";
  return (
    <a href={href} className={linkClass}>
      CRDS Exchange
    </a>
  );
}

function CrdsExchangeLinkStory() {
  return (
    <div className="w-full flex justify-start">
      <CrdsExchangeLink href="#" />
    </div>
  );
}

export default CrdsExchangeLink;