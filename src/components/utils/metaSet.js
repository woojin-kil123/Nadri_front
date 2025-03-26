import { useNavigate } from "react-router-dom";

class DropdownItem {
  constructor(icon, name, clickFunc) {
    this.icon = icon;
    this.name = name;
    this.clickFunc = clickFunc;
  }
}

export { DropdownItem };
