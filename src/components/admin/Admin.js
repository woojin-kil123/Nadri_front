import "./admin.css";
import { Tab, Tabs } from "@mui/material";

import { useEffect, useState } from "react";
import { Outlet, useLocation, useNavigate } from "react-router-dom";
import { useRecoilValue } from "recoil";
import { memberLevelState } from "../utils/RecoilData";

const Admin = () => {
  const memberLevel = useRecoilValue(memberLevelState);
  const menus = [
    { name: "메인", path: "main" },
    { name: "이벤트 관리", path: "event" },
    { name: "검색 관리", path: "keyword" },
    { name: "리뷰 관리", path: "review" },
    { name: "회원 관리", path: "member" },
    { name: "여행지 관리", path: "place" },
  ];

  return (
    <>
      {memberLevel === 2 && (
        <section className="section admin-wrap">
          <div className="left-menu-wrap">
            <VerticalTabs menus={menus} />
          </div>
          <div className="content-wrap">
            <section className="section">
              <Outlet />
            </section>
          </div>
        </section>
      )}
    </>
  );
};
export default Admin;

const VerticalTabs = ({ menus }) => {
  const navigate = useNavigate();
  const location = useLocation();
  const [value, setValue] = useState(0);

  useEffect(() => {
    const currentPath = location.pathname.split("/").pop();
    const foundIndex = menus.findIndex((menu) => menu.path === currentPath);
    if (foundIndex !== -1) {
      setValue(foundIndex);
    }
  }, [location.pathname, menus]);
  return (
    <div style={{ display: "flex" }}>
      <Tabs
        className="admin-menu"
        variant="standard"
        orientation="vertical"
        value={value}
        onChange={(_, newValue) => {
          const nextPath = `/admin/${menus[newValue].path}`;
          const currentPath = location.pathname;

          if (currentPath !== nextPath) {
            navigate(nextPath);
          }
          setValue(newValue);
        }}
        sx={{ borderRight: 1, borderColor: "divider" }}
      >
        {menus.map((menu, i) => (
          <Tab key={"adminTab" + i} label={menu.name} />
        ))}
      </Tabs>
    </div>
  );
};
