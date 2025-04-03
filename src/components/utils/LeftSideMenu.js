import { NavLink } from "react-router-dom";
import ChevronRightIcon from "@mui/icons-material/ChevronRight";

const LeftSideMenu = (props) => {
  const menus = props.menus;
  return (
    <div className="side-menu">
      <ul>
        {menus.map((menu, index) => {
          return (
            <li key={"menu-" + index}>
              <NavLink
                to={`/content/${menu.id}`}
                className={({ isActive }) => (isActive ? "active-link" : "")}
              >
                <span>{menu.text}</span>
                <ChevronRightIcon />
              </NavLink>
            </li>
          );
        })}
      </ul>
    </div>
  );
};

export default LeftSideMenu;
