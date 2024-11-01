"use client";
import React from "react";
import RoyalGamesGlobalStylesheet from "../components/royal-games-global-stylesheet";

function RoyalGamesFooter() {
  const currentYear = new Date().getFullYear();
  return (
    <footer className="bg-[#293044] text-white py-1 w-full h-[5vh] fixed bottom-0 flex flex-col justify-center">
      <RoyalGamesGlobalStylesheet />
      <p className="text-xs mb-0.5 text-center">
        &copy; {currentYear} Royal Games by Brodi Branded Inc. All rights
        reserved.
      </p>
      <img
        src="https://ucarecdn.com/8c572152-3325-4027-89b3-0d6cb48dbc29/-/format/auto/"
        alt="Royal Games Logo"
        className="mx-auto w-auto h-[1.1em]"
      />
    </footer>
  );
}
function RoyalGamesFooterStory() {
  return <RoyalGamesFooter />;
}

export default RoyalGamesFooter;