import { useNavigate } from "react-router-dom";

class DropdownItem {
  constructor(icon, name, path) {
    this.icon = icon;
    this.name = name;
    this.path = path;
  }
}

export { DropdownItem };
