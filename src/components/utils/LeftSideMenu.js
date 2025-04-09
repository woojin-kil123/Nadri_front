import { NavLink } from "react-router-dom";
import ChevronRightIcon from "@mui/icons-material/ChevronRight";

const LeftSideMenu = (props) => {
  const menus = props.menus;
  const setSelectedMenu = props.setSelectedMenu;

  return (
    <div className="side-menu">
      <ul>
        {menus.map((menu, index) => {
          return (
            <li
              key={"menu-" + index}
              onClick={() => {
                setSelectedMenu(menu.id);
                console.log("clicked:", menu.id);
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
