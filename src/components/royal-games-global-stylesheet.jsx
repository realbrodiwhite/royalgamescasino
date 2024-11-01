"use client";
import React from "react";

function RoyalGamesGlobalStylesheet() {
  return (
    <style jsx global>{`
      body {
        font-family: Arial, Helvetica, sans-serif;
        background-color: #0a0f23;
        color: #fff;
        margin: 0;
        padding: 0;
        box-sizing: border-box;
      }

      a {
        color: #fff;
        text-decoration: none;
      }

      a:hover {
        color: #f7b32b;
        text-decoration: underline;
      }

      header {
        background-color: #293044;
        padding: 10px 20px;
        display: flex;
        justify-content: space-between;
        align-items: center;
      }

      header a {
        color: #fff;
        margin: 0 10px;
      }

      main {
        padding: 20px;
      }

      h1, h2 {
        font-family: Arial, Helvetica, sans-serif;
        color: #f7b32b;
      }

      .game-container {
        display: flex;
        flex-wrap: wrap;
        justify-content: center;
      }

      .game-card {
        background-color: #1b1f38;
        border-radius: 10px;
        margin: 10px;
        padding: 20px;
        width: 300px;
        box-shadow: 0 4px 8px rgba(0, 0, 0, 0.2);
        text-align: center;
      }

      .game-card img {
        width: 100%;
        border-radius: 10px;
      }

      .game-card h3 {
        font-family: Arial, Helvetica, sans-serif;
        margin: 10px 0;
      }

      .game-card button {
        background-color: #f7b32b;
        border: none;
        border-radius: 5px;
        color: #1b1f38;
        padding: 10px 20px;
        cursor: pointer;
        font-size: 16px;
      }

      .game-card button:hover {
        background-color: #f89c1c;
      }

      footer {
        background-color: #293044;
        text-align: center;
        padding: 10px 20px;
        position: fixed;
        bottom: 0;
        width: 100%;
      }

      @media (max-width: 768px) {
        .game-card {
          width: 100%;
        }
      }

      *:focus {
        outline: 2px solid #f7b32b;
      }
    `}</style>
  );
}

function RoyalGamesGlobalStylesheetStory() {
  return (
    <div>
      <RoyalGamesGlobalStylesheet />
    </div>
  );
}

export default RoyalGamesGlobalStylesheet;