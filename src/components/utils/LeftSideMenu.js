import { NavLink } from "react-router-dom";
import ChevronRightIcon from "@mui/icons-material/ChevronRight";
import { useState } from "react";

const LeftSideMenu = (props) => {
  const menus = props.menus;
  const setSelectedMenu = props.setSelectedMenu;

  const [isActive, setIsActive] = useState(null);

  const handleClick = (menuId) => {
    setActiveId(menuId);
    setSelectedMenu(menuId);
  };

  const [activeId, setActiveId] = useState(null);

  return (
    <div className="side-menu">
      <ul>
        {menus.map((menu, index) => {
          return (
            <li
              key={"menu-" + index}
              className={activeId === menu.id ? "active-link" : ""}
              onClick={() => {
                setSelectedMenu(menu.id);
                handleClick(menu.id);
              }}
            >
              <span>{menu.name}</span>
              <ChevronRightIcon />
            </li>
          );
        })}
      </ul>
    </div>
  );
};

export default LeftSideMenu;
