import ChevronRightIcon from "@mui/icons-material/ChevronRight";
import { useState } from "react";

const LeftSideMenu = (props) => {
  const menus = props.menus;
  const setSelectedMenu = props.setSelectedMenu;

  const [activeId, setActiveId] = useState(null);
  const [selectedFilters, setSelectedFilters] = useState([]);

  const subFiltersMap = {
    12: [
      "자연관광지",
      "관광자원",
      "역사관광지",
      "휴양관광지",
      "체험관광지",
      "산업관광지",
      "건축/조형물",
    ],
    14: [
      "문화시설",
      "축제",
      "공연/행사",
      "육상 레포츠",
      "수상 레포츠",
      "항공 레포츠",
      "복합 레포츠",
      "쇼핑",
    ],
    32: [
      "관광호텔/콘도미니엄",
      "유스호스텔/레지던스",
      "팬션",
      "모텔/민박",
      "게스트하우스",
      "홈스테이",
      "한옥",
    ],
    39: [
      "한식",
      "서양식",
      "일식",
      "중식",
      "이색음식점",
      "카페/전통찻집",
      "클럽",
    ],
  };

  const handleMainClick = (menuId) => {
    setActiveId(menuId);
    setSelectedMenu(menuId);
    setSelectedFilters([]); //세부필터 초기화
  };

  const handleFilterChange = (filter) => {
    setSelectedFilters((prev) =>
      prev.includes(filter)
        ? prev.filter((f) => f !== filter)
        : [...prev, filter]
    );
  };

  console.log("activeId:", activeId);
  console.log("필터목록:", subFiltersMap[activeId]);

  return (
    <div className="side-menu">
      <ul>
        {menus.map((menu, index) => (
          <div key={"menu-" + index}>
            {/* 메인 메뉴 한 줄 */}
            <li
              className={activeId === menu.id ? "active-link" : ""}
              onClick={() => handleMainClick(menu.id)}
            >
              <span>{menu.name}</span>
              <ChevronRightIcon />
            </li>

            {/* 현재 활성 메뉴의 필터만 이 자리에서 보여줌 */}
            {activeId === menu.id && subFiltersMap[menu.id] && (
              <div className="sub-filter-wrap" style={{ paddingLeft: "10px" }}>
                {subFiltersMap[menu.id].map((filter, idx) => (
                  <label
                    key={idx}
                    style={{ display: "block", marginTop: "4px" }}
                  >
                    <input
                      type="checkbox"
                      checked={selectedFilters.includes(filter)}
                      onChange={() => handleFilterChange(filter)}
                      style={{ marginRight: "5px" }}
                    />
                    {filter}
                  </label>
                ))}
              </div>
            )}
          </div>
        ))}
      </ul>
    </div>
  );
};

export default LeftSideMenu;
