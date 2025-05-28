import Image, { type ImageProps } from "next/image";
import { Button } from "@repo/ui/button";
import styles from "./page.module.css";
import Home from "./pages/index";
import { useState, useEffect } from "react";
import { useWebSocket } from "react-use-websocket";

const WS_URL = "ws://localhost:8080";

type Props = Omit<ImageProps, "src"> & {
  srcLight: string;
  srcDark: string;
};

const ThemeImage = (props: Props) => {
  const { srcLight, srcDark, ...rest } = props;

  return (
    <>
      <Image {...rest} src={srcLight} className="imgLight" />
      <Image {...rest} src={srcDark} className="imgDark" />
    </>
  );
};

export default function Home() {
  const token = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VyaWQiOiJjbWI3eTR2NWIwMDAwaWp5NDNta3Jucmd5IiwiaWF0IjoxNzQ4NDM2ODQ0LCJleHAiOjE3NDg0NDA0NDR9.zu0bZu0OQ1FCENUmpTIE8xasaLpNE8h8LN8lBACDDj8" 
  const { connected, messages, sendMessage } = useWebSocket(WS_URL, token);
  const [roomId, setRoomId] = useState("general");
  const [input, setInput] = useState("");

  // Join room on connect
  useEffect(() => {
    if (connected) {
      sendMessage({ type: "join_room", roomId });
    }
  }, [connected, roomId, sendMessage]);

  function handleSend() {
    if (input.trim()) {
      sendMessage({ type: "chat", roomId, message: input.trim() });
      setInput("");
    }
  }

  return (
    <div style={{ maxWidth: 600, margin: "auto", padding: 20 }}>
      <h1>Chat Room: {roomId}</h1>
      <div
        style={{
          height: 300,
          border: "1px solid #ccc",
          padding: 10,
          overflowY: "auto",
          marginBottom: 10,
        }}
      >
        {messages
          .filter((m: any) => m.type === "chat" && m.roomId === roomId)
          .map((m: any, i) => (
            <div key={i}>
              <b>{m.userId}</b>: {m.message}
            </div>
          ))}
      </div>
      <input
        value={input}
        onChange={(e) => setInput(e.target.value)}
        onKeyDown={(e) => e.key === "Enter" && handleSend()}
        style={{ width: "80%", padding: 8 }}
        placeholder="Type a message..."
      />
      <button onClick={handleSend} style={{ padding: 8, marginLeft: 8 }}>
        Send
      </button>
      <div>Status: {connected ? "Connected" : "Disconnected"}</div>
    </div>
  );
}
