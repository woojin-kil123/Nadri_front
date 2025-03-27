import { useEffect, useState } from "react";

const ChatList = ({ ws, setWs }) => {
  const memberNick = "길우진";
  const [chatList, setChatList] = useState([
    {
      chatNo: "",
      chatTitle: "",
      chatGroupNo: "",
      groupSize: "",
      newMessage: "",
    },
  ]);

  const selectChatList = {
    type: "list",
    memberNick: memberNick,
  };

  const receiveMsg = (receiveData) => {
    console.log("서버에서 데이터를 받으면 실행되는 함수");
    const data = JSON.parse(receiveData.data);
    console.log(data);
  };
  const endChat = () => {
    console.log("웹소켓 연결이 끊어지면 실행되는 함수");
  };

  ws.onmessage = receiveMsg;
  ws.onclose = endChat;
  return <div>hi</div>;
};
export default ChatList;
