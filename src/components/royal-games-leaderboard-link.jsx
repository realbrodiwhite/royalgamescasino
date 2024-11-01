"use client";
import React from "react";

function RoyalGamesLeaderboardLink({ href }) {
  return (
    <a
      href={href}
      className="text-white hover:text-[#f7b32b] text-[min(5vh,16px)]"
    >
      Leaderboard
    </a>
  );
}

function RoyalGamesLeaderboardLinkStory() {
  return (
    <div className="space-y-4">
      <RoyalGamesLeaderboardLink href="#" />
      <RoyalGamesLeaderboardLink href="/another-path" />
    </div>
  );
}

export default RoyalGamesLeaderboardLink;