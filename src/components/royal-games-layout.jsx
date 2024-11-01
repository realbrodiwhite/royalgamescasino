"use client";
import React from "react";
import RoyalGamesFooter from "../components/royal-games-footer";
import RoyalGamesResponsiveHeader from "../components/royal-games-responsive-header";
import GameGridDisplay from "../components/game-grid-display";
import * as Recharts from "recharts";
import * as ShadcnUI from "@/design-libraries/shadcn-ui";

function RoyalGamesLayout() {
  const { data: session, status } = useSession();
  const [isChatOpen, setIsChatOpen] = React.useState(false);
  const [selectedThread, setSelectedThread] = React.useState(null);
  const [newMessage, setNewMessage] = React.useState("");
  const [messages, setMessages] = React.useState([]);
  const [contacts, setContacts] = React.useState([]);
  const [isAdmin, setIsAdmin] = React.useState(false);
  const [userCredits, setUserCredits] = React.useState(0);
  const [timePlayed, setTimePlayed] = React.useState("0h 0m");
  const [nextFreeSpin, setNextFreeSpin] = React.useState("0h 0m");

  React.useEffect(() => {
    if (status === "authenticated" && session?.user?.id) {
      fetch("/api/db/royalgames-users", {
        method: "POST",
        body: JSON.stringify({
          query: "SELECT * FROM `user_accounts` WHERE `id` != ?",
          values: [session.user.id],
        }),
      })
        .then((response) => response.json())
        .then((data) => {
          setContacts(data.map((user) => ({ id: user.id, name: user.name })));
        });

      fetch("/api/db/extended-user-details", {
        method: "POST",
        body: JSON.stringify({
          query: "SELECT * FROM `user_credits` WHERE `user_id` = ?",
          values: [session.user.id],
        }),
      })
        .then((response) => response.json())
        .then((data) => {
          if (data.length > 0) {
            setUserCredits(data[0].credit_balance);
            setIsAdmin(data[0].credit_balance > 1000);
            setTimePlayed(data[0].time_played || "0h 0m"); // Assuming these columns
            setNextFreeSpin(data[0].next_free_spin || "0h 0m"); // Assuming these columns
          }
        });
    }
  }, [status, session]);

  const toggleWidget = () => setIsChatOpen(!isChatOpen);

  const handleSendMessage = () => {
    if (newMessage.trim() !== "" && selectedThread) {
      setMessages([
        ...messages,
        { threadId: selectedThread.id, sender: "user", content: newMessage },
      ]);
      setNewMessage("");

      const endpoint =
        selectedThread.id === "ai_assistant"
          ? "/integrations/groq/"
          : "/integrations/anthropic-claude/";
      fetch(endpoint, {
        method: "POST",
        body: JSON.stringify({
          messages: [{ role: "user", content: newMessage }],
        }),
      })
        .then((response) => response.json())
        .then((data) => {
          setMessages((prev) => [
            ...prev,
            {
              threadId: selectedThread.id,
              sender: "ai",
              content: data.choices[0].message.content,
            },
          ]);
        });
    }
  };

  const handleSelectThread = (contact) => setSelectedThread(contact);

  return (
    <BackgroundContainer>
      <div className="flex flex-col min-h-screen">
        <div className="sticky top-0 z-[9999]">
          <RoyalGamesResponsiveHeader />
        </div>
        <div className="flex-grow overflow-y-auto pb-16">
          <div className="max-w-screen-2xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
            <div className="w-full mb-8">
              <RoyalGamesWelcomeUser
                userName={session?.user?.name || "Guest"}
                isNewUser={false}
                userTitle={isAdmin ? "King" : "Player"}
                credits={userCredits}
                timePlayed={timePlayed}
                nextFreeSpin={nextFreeSpin}
                creditHistory={[]}
                timePlayedHistory={[]}
              />
            </div>
            <div className="w-full">
              <GameGridDisplay />
            </div>
          </div>
        </div>
        <div className="sticky bottom-0 z-[9998]">
          <RoyalGamesFooter />
        </div>
      </div>
    </BackgroundContainer>
  );
}

function RoyalGamesLayoutStory() {
  return (
    <div>
      <ShadcnUI.Toaster />
      <RoyalGamesLayout />
    </div>
  );
}

export default RoyalGamesLayout;