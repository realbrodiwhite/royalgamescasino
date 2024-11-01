"use client";
import React from "react";
import * as Recharts from "recharts";
import * as ShadcnUI from "@/design-libraries/shadcn-ui";

function UserKpiDashboard({
  welcomePhrase,
  credits,
  timePlayed,
  nextFreeSpin,
  kpiTrends,
  lastGamePlayed,
}) {
  return (
    <div className="relative z-10 w-full bg-[#293044] rounded-lg p-6">
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4 mb-6">
        <CreditsCard title="CRDS Balance" value={credits} />
        <TimePlayedCard title="Time Played" value={timePlayed} />
        <NextFreeSpinCard title="Next Free Spin" value={nextFreeSpin} />
        <LastGamePlayedCard lastGamePlayed={lastGamePlayed} />
      </div>
    </div>
  );
}

function LastGamePlayedCard({ lastGamePlayed }) {
  return (
    <div className="bg-[#1e2533] rounded-lg p-4 shadow-lg flex flex-col justify-between h-full">
      <div className="text-center flex-grow flex flex-col justify-center">
        <h3 className="text-lg font-semibold text-white mb-2">
          Last Game Played:
        </h3>
        <p className="text-xl font-bold text-[#f7b32b] mb-4">
          {lastGamePlayed.name}
        </p>
        <div className="w-full aspect-square mb-4 flex items-center justify-center">
          {lastGamePlayed.image ? (
            <img
              src={lastGamePlayed.image}
              alt={lastGamePlayed.name}
              className="w-full h-full object-cover"
            />
          ) : (
            <p className="text-white text-center">No image available</p>
          )}
        </div>
        <p className="text-sm text-gray-400 mb-4">
          Last played: {lastGamePlayed.datePlayed}
        </p>
      </div>
      <button className="w-full bg-yellow-500 text-white py-2 px-4 rounded-md hover:bg-yellow-600 transition duration-300">
        Play Now
      </button>
    </div>
  );
}

function NextFreeSpinCard({ title, value }) {
  return (
    <div className="bg-[#1e2533] rounded-lg p-4 shadow-lg flex flex-col justify-between h-full">
      <div className="text-[15px] flex-grow flex flex-col justify-center">
        <h3 className="text-[18px] font-semibold text-white mb-2 text-center">
          {title}
        </h3>
        <p className="text-xl font-bold text-[#f7b32b] text-center mb-4">
          <span className="text-[18px]">{value}</span>
        </p>
        <p className="text-[23px] text-white text-center">
          You can skip the wait and get your Free Spin right now for only CRDS
          0.99 .
        </p>
      </div>
      <div>
        <button className="w-full bg-yellow-500 text-white py-2 px-4 rounded-md hover:bg-yellow-600 transition duration-300 mb-2">
          Get Free Spin Now
        </button>
        <a
          href="/credit-exchange"
          className="block w-full bg-blue-500 text-white text-center py-2 px-4 rounded-md hover:bg-blue-600 transition duration-300"
        >
          Buy CRDS
        </a>
      </div>
    </div>
  );
}

function CreditsCard({ title, value }) {
  const [activeTab, setActiveTab] = React.useState("hourly");

  const mockData = {
    hourly: [
      { time: "00:00", credits: 1000 },
      { time: "04:00", credits: 1200 },
      { time: "08:00", credits: 1100 },
      { time: "12:00", credits: 1300 },
      { time: "16:00", credits: 1250 },
      { time: "20:00", credits: 1350 },
    ],
    daily: [
      { date: "2023-01-01", credits: 1000 },
      { date: "2023-01-02", credits: 1200 },
      { date: "2023-01-03", credits: 1100 },
      { date: "2023-01-04", credits: 1300 },
      { date: "2023-01-05", credits: 1250 },
      { date: "2023-01-06", credits: 1350 },
      { date: "2023-01-07", credits: 1400 },
    ],
    monthly: [
      { month: "Jan", credits: 30000 },
      { month: "Feb", credits: 35000 },
      { month: "Mar", credits: 33000 },
      { month: "Apr", credits: 38000 },
      { month: "May", credits: 36000 },
      { month: "Jun", credits: 40000 },
    ],
  };

  return (
    <div className="bg-[#1e2533] rounded-lg p-4 shadow-lg flex flex-col justify-between h-full">
      <div>
        <h3 className="text-lg font-semibold text-white mb-2 text-center">
          {title}
        </h3>
        <p className="text-xl font-bold text-[#f7b32b] text-center mb-4">
          {value}
        </p>
        <div className="w-full aspect-square mb-4">
          <Recharts.ResponsiveContainer width="100%" height="100%">
            <Recharts.LineChart data={mockData[activeTab]}>
              <Recharts.CartesianGrid strokeDasharray="3 3" />
              <Recharts.XAxis
                dataKey={
                  activeTab === "hourly"
                    ? "time"
                    : activeTab === "daily"
                    ? "date"
                    : "month"
                }
              />
              <Recharts.YAxis />
              <Recharts.Tooltip />
              <Recharts.Line
                type="monotone"
                dataKey="credits"
                stroke="#8884d8"
              />
            </Recharts.LineChart>
          </Recharts.ResponsiveContainer>
        </div>
      </div>
      <div className="flex justify-center">
        <button
          className={`px-2 py-1 mr-2 rounded ${
            activeTab === "hourly" ? "bg-yellow-500" : "bg-gray-500"
          }`}
          onClick={() => setActiveTab("hourly")}
        >
          Hourly
        </button>
        <button
          className={`px-2 py-1 mr-2 rounded ${
            activeTab === "daily" ? "bg-yellow-500" : "bg-gray-500"
          }`}
          onClick={() => setActiveTab("daily")}
        >
          Daily
        </button>
        <button
          className={`px-2 py-1 rounded ${
            activeTab === "monthly" ? "bg-yellow-500" : "bg-gray-500"
          }`}
          onClick={() => setActiveTab("monthly")}
        >
          Monthly
        </button>
      </div>
    </div>
  );
}

function TimePlayedCard({ title, value }) {
  const [activeTab, setActiveTab] = React.useState("daily");

  const mockData = {
    hourly: [
      { time: "00:00", hours: 0.5 },
      { time: "04:00", hours: 1.2 },
      { time: "08:00", hours: 0.8 },
      { time: "12:00", hours: 1.5 },
      { time: "16:00", hours: 1.1 },
      { time: "20:00", hours: 1.3 },
    ],
    daily: [
      { date: "2023-01-01", hours: 2 },
      { date: "2023-01-02", hours: 3 },
      { date: "2023-01-03", hours: 1.5 },
      { date: "2023-01-04", hours: 4 },
      { date: "2023-01-05", hours: 2.5 },
      { date: "2023-01-06", hours: 3.5 },
      { date: "2023-01-07", hours: 5 },
    ],
    monthly: [
      { month: "Jan", hours: 60 },
      { month: "Feb", hours: 75 },
      { month: "Mar", hours: 68 },
      { month: "Apr", hours: 82 },
      { month: "May", hours: 70 },
      { month: "Jun", hours: 90 },
    ],
  };

  return (
    <div className="bg-[#1e2533] rounded-lg p-4 shadow-lg flex flex-col justify-between h-full">
      <div>
        <h3 className="text-lg font-semibold text-white mb-2 text-center">
          {title}
        </h3>
        <p className="text-xl font-bold text-[#f7b32b] text-center mb-4">
          {value}
        </p>
        <div className="w-full aspect-square mb-4">
          <Recharts.ResponsiveContainer width="100%" height="100%">
            <Recharts.BarChart data={mockData[activeTab]}>
              <Recharts.CartesianGrid strokeDasharray="3 3" />
              <Recharts.XAxis
                dataKey={
                  activeTab === "hourly"
                    ? "time"
                    : activeTab === "daily"
                    ? "date"
                    : "month"
                }
              />
              <Recharts.YAxis />
              <Recharts.Tooltip />
              <Recharts.Bar dataKey="hours" fill="#8884d8" />
            </Recharts.BarChart>
          </Recharts.ResponsiveContainer>
        </div>
      </div>
      <div className="flex justify-center">
        <button
          className={`px-2 py-1 mr-2 rounded ${
            activeTab === "hourly" ? "bg-yellow-500" : "bg-gray-500"
          }`}
          onClick={() => setActiveTab("hourly")}
        >
          Hourly
        </button>
        <button
          className={`px-2 py-1 mr-2 rounded ${
            activeTab === "daily" ? "bg-yellow-500" : "bg-gray-500"
          }`}
          onClick={() => setActiveTab("daily")}
        >
          Daily
        </button>
        <button
          className={`px-2 py-1 rounded ${
            activeTab === "monthly" ? "bg-yellow-500" : "bg-gray-500"
          }`}
          onClick={() => setActiveTab("monthly")}
        >
          Monthly
        </button>
      </div>
    </div>
  );
}

function UserKpiDashboardStory() {
  const kpiTrends = [
    { date: "2023-01-01", credits: 1000, timePlayed: 10, freeSpins: 5 },
    { date: "2023-01-02", credits: 1200, timePlayed: 15, freeSpins: 7 },
    { date: "2023-01-03", credits: 1100, timePlayed: 12, freeSpins: 6 },
    { date: "2023-01-04", credits: 1300, timePlayed: 18, freeSpins: 8 },
    { date: "2023-01-05", credits: 1250, timePlayed: 16, freeSpins: 7 },
    { date: "2023-01-06", credits: 1350, timePlayed: 20, freeSpins: 9 },
    { date: "2023-01-07", credits: 1400, timePlayed: 22, freeSpins: 10 },
    { date: "2023-01-08", credits: 1450, timePlayed: 23, freeSpins: 11 },
    { date: "2023-01-09", credits: 1500, timePlayed: 25, freeSpins: 12 },
    { date: "2023-01-10", credits: 1550, timePlayed: 27, freeSpins: 13 },
    { date: "2023-01-11", credits: 1600, timePlayed: 29, freeSpins: 14 },
    { date: "2023-01-12", credits: 1650, timePlayed: 30, freeSpins: 15 },
  ];

  const lastGamePlayed = {
    name: "Space Invaders",
    image: "../assets/space-invaders.png",
    datePlayed: "2023-01-12",
  };

  return (
    <div className="bg-gray-100 p-4">
      <UserKpiDashboard
        welcomePhrase="Welcome!"
        credits={1600}
        timePlayed="4h 30m"
        nextFreeSpin="1h 30m"
        kpiTrends={kpiTrends}
        lastGamePlayed={lastGamePlayed}
      />
    </div>
  );
}

export default UserKpiDashboard;