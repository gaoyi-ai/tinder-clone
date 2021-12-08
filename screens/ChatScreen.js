import React from "react";
import { SafeAreaView } from "react-native-safe-area-context";
import tw from "tailwind-rn";
import ChatList from "../components/ChatList";
import Header from "../components/Header";


const ChatScreen = () => {
  return (
    <SafeAreaView style={tw("")}>
      <Header title="Chat" />
      <ChatList />
    </SafeAreaView>
  );
};

export default ChatScreen;
