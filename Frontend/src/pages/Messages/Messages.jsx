import React, { useEffect, useState } from "react";
import useApi from "../../customeHooks/useApi";
import profile from "../../assets/profile.png";
import { jwtDecode } from "jwt-decode";
import socket from "../../socket";
import "./messages.css";
import { useRef } from "react";


const Messages = () => {
  const bottomRef = useRef();
  const { Api } = useApi();
  const token = localStorage.getItem("token");
  const currentUser = jwtDecode(token);
  const [friends, setFriends] = useState([]);
  const [selectedFriend, setSelectedFriend] = useState(null);
  const [text, setText] = useState("");
  const [messages, setMessages] = useState([]);
  async function getFriends() {
    const res = await Api("https://backend-r2uw.onrender.com/friends", "get");
    setFriends(res);
  }
  async function openChat(friend) {
    setSelectedFriend(friend);
    const res = await Api(`https://backend-r2uw.onrender.com/messages/${friend._id}`, "get");
    setMessages(res);
  }
  function handleKeyDown(e) {
    if (e.key === "Enter") {
      e.preventDefault();
      sendMessage();
    }
  }
  function sendMessage() {
    if (!text.trim() || !selectedFriend) return;
    socket.emit("sendMessage", {
      senderId: currentUser.id,
      receiverId: selectedFriend._id,
      message: text
    });
    setText("");
  }
  useEffect(() => {
    bottomRef.current?.scrollIntoView({
      behavior: "smooth"
    });
    getFriends();
    socket.emit("registerUser", currentUser.id);
    socket.on("receiveMessage", (data) => {
      setMessages(prev => [...prev, data]);
    });
    return () => {
      socket.off("receiveMessage");
    };
  }, []);
  useEffect(() => {
    bottomRef.current?.scrollIntoView({
      behavior: "smooth"
    });
  }, [messages]);
  return (
    <div className="message-page">
      <div className="friends-list">
        <h3>Friends</h3>
        {
          friends.map(friend => (
            <div key={friend._id} className={`friend ${selectedFriend?._id === friend._id ? "active" : ""}`} onClick={() => openChat(friend)} >
              <img src={friend.profilePic ? `https://backend-r2uw.onrender.com/uploads/${friend.profilePic}` : profile} alt="" />
              <div>
                <h5>{friend.userName}</h5>
                <small>Online</small>
              </div>
            </div>
          ))
        }
      </div>
      <div className="chat-section">
        {
          selectedFriend ?
            <>
              <div className="chat-header">
                <img src={selectedFriend.profilePic ? `https://backend-r2uw.onrender.com/uploads/${selectedFriend.profilePic}` : profile} alt="" />
                <h4>{selectedFriend.userName}</h4>
              </div>
              <div className="chat-body">
                {
                  messages.map(msg => (
                    <div key={msg._id} className={msg.sender === currentUser.id ? "my-message" : "friend-message"} >
                      {msg.message}
                    </div>
                  ))
                }
                <div ref={bottomRef}></div>
              </div>
              <div className="chat-footer">
                <input value={text} onChange={(e) => setText(e.target.value)} onKeyDown={handleKeyDown} placeholder="Type a message..." />
                <button onClick={sendMessage}>
                  Send
                </button>
              </div>
            </>
            :
            <div className="select-user">
              Select a friend to start chatting
            </div>
        }
      </div>
    </div>
  );

};

export default Messages;