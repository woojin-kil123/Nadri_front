import { useRecoilValue } from "recoil";
import { placeTypeState } from "./RecoilData";

class DropdownItem {
  constructor(icon, name, clickFunc) {
    this.icon = icon;
    this.name = name;
    this.clickFunc = clickFunc;
  }
}
class ChatMsg {
  constructor(type, chatNo, message) {
    this.type = type;
    this.chatNo = chatNo;
    this.message = message;
  }
}
function createChatMsg(type, chatNo, message) {
  return JSON.stringify(new ChatMsg(type, chatNo, message));
}
const getKoreanToday = () => {
  const today = new Date();

  // 1. 맨 끝의 마침표 제거 먼저
  const cleaned = today
    .toLocaleDateString("ko-KR", {
      year: "numeric",
      month: "2-digit",
      day: "2-digit",
    })
    .replace(/\.$/, "");

  // 2. 남은 점과 공백 → 하이픈으로 변환
  return cleaned.replace(/\.\s?/g, "-");
};

export { DropdownItem, createChatMsg, getKoreanToday };
