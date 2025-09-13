"use client";

import dynamic from "next/dynamic";

// Do the client-only dynamic import here (allowed, because this file is a Client Component)
const ChatWidget = dynamic(() => import("./chat-widget"), { ssr: false });

export default function ChatMount() {
  return <ChatWidget />;
}
