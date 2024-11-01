"use client";
import React from "react";
import RoyalGamesGlobalStylesheet from "../components/royal-games-global-stylesheet";
import GameTypesLink from "../components/game-types-link";
import RoyalGamesLeaderboardLink from "../components/royal-games-leaderboard-link";
import CrdsExchangeLink from "../components/crds-exchange-link";

function RoyalGamesResponsiveHeader() {
  const [isSearchVisible, setIsSearchVisible] = React.useState(false);
  const [isDropdownVisible, setIsDropdownVisible] = React.useState(false);
  const { data: session, status } = useSession();

  const toggleSearch = () => setIsSearchVisible(!isSearchVisible);
  const toggleDropdown = () => setIsDropdownVisible(!isDropdownVisible);

  const handleNewFunction = async () => {
    try {
      const response = await fetch("/api/new-function", { method: "POST" });
      const data = await response.json();
      console.log(data);
    } catch (error) {
      console.error("Error calling new function:", error);
    }
  };

  return (
    <>
      <RoyalGamesGlobalStylesheet />
      <header
        className="bg-[#293044] px-4 py-2 flex items-center justify-between header-container"
        role="banner"
      >
        <div className="flex items-center">
          <img
            src="https://ucarecdn.com/35b300c3-a162-413f-af5d-5ab6256750be/-/format/auto/"
            alt="Royal Games Logo"
            className="h-10 w-auto mr-4 header-logo"
            style={{ maxWidth: "150px", height: "40px", objectFit: "contain" }}
            loading="lazy"
          />
          <nav
            className="hidden md:flex space-x-4 header-nav"
            role="navigation"
          >
            <ul className="flex space-x-4">
              <li>
                <GameTypesLink href="/" />
              </li>
              <li>
                <RoyalGamesLeaderboardLink href="/leaderboard" />
              </li>
              <li>
                <CrdsExchangeLink href="/crds-exchange" />
              </li>
            </ul>
          </nav>
        </div>
        <div className="flex items-center space-x-4">
          <button
            onClick={toggleSearch}
            className="text-white text-4xl p-4"
            aria-label="Toggle search"
          >
            <i className="fas fa-search"></i>
          </button>
          {isSearchVisible && (
            <input
              type="text"
              placeholder="Search..."
              className="bg-white text-black px-2 py-1 rounded absolute right-[180px] top-[14px] header-search"
              aria-label="Search"
              name="search"
              role="search"
            />
          )}
          <button
            className="text-white text-4xl p-4"
            aria-label="Notifications"
          >
            <i className="fas fa-bell"></i>
          </button>
          <button className="text-white text-4xl p-4" aria-label="Help">
            <i className="fas fa-question-circle"></i>
          </button>
          <button
            onClick={handleNewFunction}
            className="text-white text-4xl p-4"
            aria-label="New Function"
          >
            <i className="fas fa-plus-circle"></i>
          </button>
          <div className="relative">
            <button
              onClick={toggleDropdown}
              className="flex items-center p-4"
              aria-haspopup="true"
              aria-expanded={isDropdownVisible}
            >
              <img
                src="/path/to/user-avatar.jpg"
                alt="User Avatar"
                className="h-10 w-10 rounded-full header-avatar"
                loading="lazy"
              />
            </button>
            {isDropdownVisible && (
              <div className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg py-1 text-gray-700">
                <a href="#" className="block px-4 py-2 hover:bg-gray-100">
                  Profile
                </a>
                <a href="#" className="block px-4 py-2 hover:bg-gray-100">
                  Settings
                </a>
                <a
                  href="/account/logout"
                  className="block px-4 py-2 hover:bg-gray-100"
                >
                  Logout
                </a>
              </div>
            )}
          </div>
        </div>
      </header>
    </>
  );
}

function RoyalGamesResponsiveHeaderStory() {
  return (
    <div className="w-full">
      <RoyalGamesResponsiveHeader />
    </div>
  );
}

export default RoyalGamesResponsiveHeader;