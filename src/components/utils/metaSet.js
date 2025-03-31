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

export { DropdownItem, createChatMsg };
