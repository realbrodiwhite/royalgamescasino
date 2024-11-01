"use client";
import React from "react";

function FriendsLink({ linkText = "Friends", href = "/friends" }) {
  return (
    <a
      href={href}
      className="font-roboto text-white bg-blue-600 hover:bg-blue-700 px-4 py-2 rounded-full inline-block transition-colors duration-200"
    >
      <i className="fas fa-users mr-2"></i>
      {linkText}
    </a>
  );
}

function FriendsLinkStory() {
  return (
    <div className="p-4 bg-gray-800">
      <FriendsLink linkText="Friends" href="/friends" />
    </div>
  );
}

export default FriendsLink;