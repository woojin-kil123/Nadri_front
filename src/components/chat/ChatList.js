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
  useEffect(() => {
    ws.send(selectChatList);
  }, [chatList]);
  const selectChatList = {
    type: "list",
    memberNick: memberNick,
  };

  const startChat = () => {
    console.log("웹소켓 연결 시 실행되는 함수");
    ws.send(selectChatList); //매개변수로 전달한 문자열을 연결된 웹소켓 서버로 전송
  };
  const receiveMsg = (receiveData) => {
    console.log("서버에서 데이터를 받으면 실행되는 함수");
    const data = JSON.parse(receiveData.data);
    console.log(data);
  };
  const endChat = () => {
    console.log("웹소켓 연결이 끊어지면 실행되는 함수");
  };

  ws.onopen = startChat;
  ws.onmessage = receiveMsg;
  ws.onclose = endChat;
  return <div>hi</div>;
};
export default ChatList;
