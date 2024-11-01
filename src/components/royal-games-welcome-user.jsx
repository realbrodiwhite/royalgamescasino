"use client";
import React from "react";
import RoyalGamesGlobalStylesheet from "../components/royal-games-global-stylesheet";
import * as Recharts from "recharts";
import * as ShadcnUI from "@/design-libraries/shadcn-ui";

function RoyalGamesWelcomeUser({
  userName,
  isNewUser,
  userTitle,
  credits,
  timePlayed,
  nextFreeSpin,
  creditHistory,
  timePlayedHistory,
}) {
  const { data: session, status } = useSession();
  const titles = isNewUser
    ? ["adventurer"]
    : userTitle === "King"
    ? ["King"]
    : ["Queen", "Princess", "Prince"];
  const welcomePhrases = [
    `Hark! {USERNAME} the {TITLE} approaches!`,
    `Greetings, noble {USERNAME}!`,
    ...Array.from({ length: 200 }).fill(`Well met, {USERNAME} the {TITLE}!`),
    `Good {TIME} {USERNAME}!`,
    `Welcome back {TITLE} {USERNAME}!`,
    `Welcome, log in to play!`,
    `Salutations, {USERNAME}!`,
  ];

  const speakers = [
    "the Fairest Maiden",
    "Court Jester",
    "Sir Alfred",
    "Local Peasant",
    "Brom the Blacksmith",
    "Town Beggar",
  ];

  const getRandomWelcomePhrase = () => {
    const phrase =
      welcomePhrases[Math.floor(Math.random() * welcomePhrases.length)];
    const speaker = speakers[Math.floor(Math.random() * speakers.length)];
    const name = Math.random() < 0.7 && userName ? `- said ${speaker}` : "";
    const title = titles[Math.floor(Math.random() * titles.length)];
    const timeOfDay = new Date().getHours() < 12 ? "morning" : "evening";
    return `"${phrase
      .replace("{USERNAME}", userName || "adventurer")
      .replace("{TIME}", timeOfDay)
      .replace("{TITLE}", title)}" ${name}`;
  };

  const welcomePhrase = getRandomWelcomePhrase();

  const mockCreditHistory = [
    { date: "2023-01-01", credits: 500 },
    { date: "2023-01-02", credits: 600 },
    { date: "2023-01-03", credits: 550 },
    { date: "2023-01-04", credits: 700 },
    { date: "2023-01-05", credits: 800 },
  ];

  const mockTimePlayedHistory = [
    { date: "2023-01-01", minutes: 30 },
    { date: "2023-01-02", minutes: 45 },
    { date: "2023-01-03", minutes: 60 },
    { date: "2023-01-04", minutes: 40 },
    { date: "2023-01-05", minutes: 55 },
  ];

  return (
    <div className="relative w-full flex flex-col items-center">
      <RoyalGamesGlobalStylesheet />
      <div className="relative w-full flex flex-col items-center justify-center px-4 py-8">
        <div className="absolute inset-0 z-0">
          <img
            src="https://ucarecdn.com/35b300c3-a162-413f-af5d-5ab6256750be/-/format/auto/"
            alt="Royal Games Logo"
            className="w-full h-full object-cover opacity-30"
          />
        </div>
        <div className="relative z-10 w-full max-w-6xl flex flex-col gap-4">
          <div className="bg-[#293044] bg-opacity-90 rounded-3xl p-6">
            <p
              className="text-lg font-bold italic text-[#f7b32b] px-4 py-2 text-center"
              style={{
                textShadow:
                  "-1px -1px 0 #000, 1px -1px 0 #000, -1px 1px 0 #000, 1px 1px 0 #000",
              }}
            >
              {welcomePhrase}
            </p>
          </div>
          <div className="bg-[#293044] bg-opacity-90 rounded-3xl p-6 w-full">
            <UserKpiDashboard
              welcomePhrase={welcomePhrase}
              credits={credits}
              timePlayed={timePlayed}
              nextFreeSpin={nextFreeSpin}
              kpiTrends={{
                creditHistory: creditHistory || mockCreditHistory,
                timePlayedHistory: timePlayedHistory || mockTimePlayedHistory,
              }}
              lastGamePlayed={{
                name: "Space Invaders",
                image: "/assets/space-invaders.png",
                datePlayed: "2023-01-12",
              }}
            />
          </div>
        </div>
      </div>
    </div>
  );
}

function RoyalGamesWelcomeUserStory() {
  const mockCreditHistory = [
    { date: "2023-01-01", credits: 800 },
    { date: "2023-01-02", credits: 900 },
    { date: "2023-01-03", credits: 950 },
    { date: "2023-01-04", credits: 1000 },
    { date: "2023-01-05", credits: 1100 },
  ];

  const mockTimePlayedHistory = [
    { date: "2023-01-01", minutes: 60 },
    { date: "2023-01-02", minutes: 75 },
    { date: "2023-01-03", minutes: 90 },
    { date: "2023-01-04", minutes: 70 },
    { date: "2023-01-05", minutes: 85 },
  ];

  return (
    <div>
      <RoyalGamesWelcomeUser
        userName="Arthur"
        isNewUser={false}
        userTitle="King"
        credits={1000}
        timePlayed="2h 30m"
        nextFreeSpin="1h 15m"
        creditHistory={mockCreditHistory}
        timePlayedHistory={mockTimePlayedHistory}
      />
      <RoyalGamesWelcomeUser
        userName="Guinevere"
        isNewUser={false}
        userTitle="Queen"
        credits={500}
        timePlayed="1h 20m"
        nextFreeSpin="0h 45m"
      />
      <RoyalGamesWelcomeUser
        userName="Lancelot"
        isNewUser={true}
        userTitle="Sir"
        credits={1500}
        timePlayed="3h 50m"
        nextFreeSpin="2h 10m"
      />
      <RoyalGamesWelcomeUser
        credits={700}
        timePlayed="1h 5m"
        nextFreeSpin="3h"
      />
    </div>
  );
}

export default RoyalGamesWelcomeUser;