"use client";
import React from "react";

function RoyalGamesChatWidget() {
  const [isOpen, setIsOpen] = React.useState(false);
  const [selectedThread, setSelectedThread] = React.useState(null);
  const [newMessage, setNewMessage] = React.useState("");
  const [messages, setMessages] = React.useState([]);
  const [contacts, setContacts] = React.useState([]);
  const [isAdmin, setIsAdmin] = React.useState(false);
  const [searchTerm, setSearchTerm] = React.useState("");
  const [hasNewMessages, setHasNewMessages] = React.useState(false);
  const [hasNotifications, setHasNotifications] = React.useState(false);
  const [userInfo, setUserInfo] = React.useState(null);
  const { data: session, status } = useSession();

  React.useEffect(() => {
    if (status === "authenticated" && session?.user?.id) {
      fetchUserInfo(session.user.id);
      fetchContacts(session.user.id);
      checkAdminStatus(session.user.id);
    }
  }, [status, session]);

  const fetchUserInfo = (userId) => {
    fetch("/api/db/extended-user-details", {
      method: "POST",
      body: JSON.stringify({
        query: "SELECT * FROM `user_credits` WHERE `user_id` = ?",
        values: [userId],
      }),
    })
      .then((response) => response.json())
      .then((data) => {
        if (data.length > 0) {
          setUserInfo(data[0]);
        }
      })
      .catch((error) => console.error("Error fetching user info:", error));
  };

  const fetchContacts = (userId) => {
    fetch("/api/db/royalgames-users", {
      method: "POST",
      body: JSON.stringify({
        query: "SELECT * FROM `user_accounts` WHERE `id` != ?",
        values: [userId],
      }),
    })
      .then((response) => response.json())
      .then((data) => {
        setContacts([
          { id: "ai_assistant", name: "AI Customer Support" },
          ...data.map((user) => ({ id: user.id, name: user.name })),
        ]);
      })
      .catch((error) => console.error("Error fetching contacts:", error));
  };

  const checkAdminStatus = (userId) => {
    fetch("/api/db/extended-user-details", {
      method: "POST",
      body: JSON.stringify({
        query: "SELECT * FROM `user_credits` WHERE `user_id` = ?",
        values: [userId],
      }),
    })
      .then((response) => response.json())
      .then((data) => {
        if (data.length > 0 && data[0].credit_balance > 1000) {
          setIsAdmin(true);
          setContacts((prev) => [
            ...prev,
            { id: "data_analyst", name: "Data Analyst AI" },
            { id: "notification_manager", name: "Notification Manager AI" },
          ]);
        }
      })
      .catch((error) => console.error("Error checking admin status:", error));
  };

  const toggleWidget = () => {
    setIsOpen(!isOpen);
    if (isOpen) {
      setHasNewMessages(false);
      setHasNotifications(false);
    }
  };

  const handleSendMessage = () => {
    if (newMessage.trim() !== "" && selectedThread) {
      const newUserMessage = {
        threadId: selectedThread.id,
        sender: "user",
        content: newMessage,
      };
      setMessages([...messages, newUserMessage]);
      setNewMessage("");

      const aiEndpoint =
        selectedThread.id === "ai_assistant"
          ? "/integrations/groq/"
          : "/integrations/anthropic-claude/";

      fetch(aiEndpoint, {
        method: "POST",
        body: JSON.stringify({
          messages: [
            {
              role: "system",
              content: `You are an AI assistant for Royal Games. The user's information: ${JSON.stringify(
                userInfo
              )}. You have access to the entire platform's documentation. Respond accordingly.`,
            },
            { role: "user", content: newMessage },
          ],
        }),
      })
        .then((response) => response.json())
        .then((data) => {
          if (data.choices && data.choices.length > 0) {
            const aiResponse = {
              threadId: selectedThread.id,
              sender: "ai",
              content: data.choices[0].message.content,
            };
            setMessages((prev) => [...prev, aiResponse]);
            if (!isOpen) {
              setHasNewMessages(true);
            }
          }
        })
        .catch((error) => console.error("Error sending message to AI:", error));
    }
  };

  const handleSelectThread = (contact) => {
    setSelectedThread(contact);
  };

  const filteredContacts = React.useMemo(() => {
    return contacts.filter((contact) =>
      contact.name.toLowerCase().includes(searchTerm.toLowerCase())
    );
  }, [contacts, searchTerm]);

  return (
    <div
      className={`fixed bottom-16 right-4 transition-all duration-300 z-50 ${
        isOpen
          ? "w-[90vw] h-[90vw] md:w-[80vh] md:h-[80vh] lg:w-[70vh] lg:h-[70vh] max-w-[600px] max-h-[600px]"
          : "w-[10vw] h-[10vw] max-w-24 max-h-24"
      }`}
    >
      {isOpen ? (
        <div className="flex flex-col h-full bg-transparent rounded-lg shadow-lg overflow-hidden">
          <div className="bg-[#1b1f38] text-white p-3 flex justify-between items-center">
            <h3 className="font-bold text-lg">Royal Games Chat</h3>
            <button
              onClick={toggleWidget}
              className="text-white hover:text-gray-200"
            >
              <i className="fas fa-times text-xl"></i>
            </button>
          </div>
          <div className="flex-grow overflow-y-auto p-3 bg-white bg-opacity-80">
            {selectedThread ? (
              <div className="h-full flex flex-col">
                <div className="flex-grow overflow-y-auto mb-3">
                  {messages
                    .filter((m) => m.threadId === selectedThread.id)
                    .map((message, index) => (
                      <div
                        key={index}
                        className={`mb-2 ${
                          message.sender === "user" ? "text-right" : "text-left"
                        }`}
                      >
                        <span
                          className={`inline-block p-2 rounded-lg ${
                            message.sender === "user"
                              ? "bg-[#f7b32b] text-[#1b1f38]"
                              : "bg-gray-200 text-[#1b1f38]"
                          }`}
                        >
                          {message.content}
                        </span>
                      </div>
                    ))}
                </div>
                <div className="flex">
                  <input
                    type="text"
                    value={newMessage}
                    onChange={(e) => setNewMessage(e.target.value)}
                    className="flex-grow border rounded-l-lg p-2 text-base"
                    placeholder="Type a message..."
                    name="message"
                  />
                  <button
                    onClick={handleSendMessage}
                    className="bg-[#f7b32b] text-[#1b1f38] p-2 rounded-r-lg"
                  >
                    <i className="fas fa-paper-plane text-lg"></i>
                  </button>
                </div>
              </div>
            ) : (
              <div>
                <h4 className="font-bold mb-2 text-lg">Contacts</h4>
                <input
                  type="text"
                  placeholder="Search contacts..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full p-2 mb-2 border rounded text-base"
                  name="search"
                />
                {filteredContacts.map((contact, index) => (
                  <div
                    key={index}
                    onClick={() => handleSelectThread(contact)}
                    className="cursor-pointer hover:bg-gray-100 p-3 rounded text-base"
                  >
                    {contact.name}
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      ) : (
        <button
          onClick={toggleWidget}
          className={`w-full h-full rounded-full bg-[#f7b32b] text-[#1b1f38] flex items-center justify-center shadow-lg ${
            hasNewMessages || hasNotifications ? "animate-pulse" : ""
          }`}
        >
          <i className="fas fa-comment-dots text-5xl"></i>
        </button>
      )}
    </div>
  );
}

function RoyalGamesChatWidgetStory() {
  return (
    <div>
      <RoyalGamesChatWidget />
    </div>
  );
}

export default RoyalGamesChatWidget;