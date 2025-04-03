import { NavLink } from "react-router-dom";
import ChevronRightIcon from "@mui/icons-material/ChevronRight";

const LeftSideMenu = (props) => {
  const menus = props.menus;
  const setSelectedMenu = props.setSelectedMenu;
  const selectedMenu = props.selectedMenu;
  const currentMenu = props.currentMenu;
  return (
    <div className="side-menu">
      <ul>
        {menus.map((menu, index) => {
          return (
            <li key={"menu-" + index}>
              <NavLink
                to={`/content/${menu.name2}`}
                className={({ isActive }) => (isActive ? "active-link" : "")}
                onClick={() => {
                  setSelectedMenu(currentMenu);
                  console.log(selectedMenu);
                }}
              >
                <span>{menu.name}</span>
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
