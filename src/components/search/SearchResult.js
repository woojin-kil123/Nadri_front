import { useLocation, useParams } from "react-router-dom";
import { useRecoilValue } from "recoil";
import { placeTypeState } from "../utils/RecoilData";
import { useEffect, useState } from "react";
import axios from "axios";
import { Box, Pagination, Stack, Tab, Tabs } from "@mui/material";
import ListCard from "../utils/ListCard";
import PageNavigation from "../utils/PageNavigtion";

const SearchResult = () => {
  const location = useLocation();
  const queryParams = new URLSearchParams(location.search);
  const [query, setQuery] = useState(null);
  const [typeId, setTypeId] = useState(null);
  const placeType = useRecoilValue(placeTypeState);
  const [placeResult, setPlaceResult] = useState(null);
  const [reqPage, setReqPage] = useState(null);
  const contentType = [
    { id: 1, name: "여행 정보" },
    { id: 2, name: "플랜" },
    { id: 3, name: "리뷰" },
  ];
  const [onContent, setOnContent] = useState("");
  useEffect(() => {
    setQuery(queryParams.get("query"));
    setTypeId(queryParams.getAll("type"));
  }, [location]);
  useEffect(() => {
    if (query || typeId) {
      axios
        .get(
          `${process.env.REACT_APP_BACK_SERVER}/search?query=${query}&type=${placeType[0].id}`
        )
        .then((res) => {
          console.log(res.data);
          setPlaceResult(res.data.place);
        });
    }
  }, [query, typeId]);
  return (
    <>
      <h1>{query ? `${query}` : ""} 검색결과</h1>
      <section className="section">
        <FilterNavWithPanel
          categories={contentType}
          on={onContent}
          setOn={setOnContent}
        />
        <div className="result-wrap">
          {placeResult && (
            <>
              <div className="place-wrap">
                {placeResult.list.map((item, i) => (
                  <ListCard key={"card-" + i} place={item} />
                ))}
              </div>
              <div className="pageNavi-box">
                <Stack spacing={2}>
                  <Pagination
                    count={placeResult.pi.totalPage}
                    sx={{
                      "& .Mui-selected": {
                        backgroundColor: "var(--main2)", // 원하는 파란색
                        color: "#fff",
                        borderRadius: "50%",
                      },
                      "& .MuiPaginationItem-root": {
                        borderRadius: "50%", // 전체 버튼 둥글게
                      },
                    }}
                  />
                </Stack>
              </div>
            </>
          )}
        </div>
      </section>
    </>
  );
};
export default SearchResult;

const FilterNavWithPanel = ({ categories, on, setOn }) => {
  const tabIndex = categories.findIndex((type) => type.id === on); // 문자열인 on → index 변환
  const handleChange = (_, newIndex) => {
    const selected = categories[newIndex].id;
    setOn(selected);
  };

  return (
    <Box sx={{ width: "100%", bgcolor: "background.paper", p: 1 }}>
      <Tabs
        value={tabIndex === -1 ? 0 : tabIndex}
        onChange={handleChange}
        aria-label="category tabs"
        indicatorColor="primary"
        sx={{
          "& .MuiTabs-indicator": {
            backgroundColor: "#27b778",
          },
        }}
      >
        {categories.map((category, i) => (
          <Tab key={category.id + "-" + i} label={category.name} />
        ))}
      </Tabs>
    </Box>
  );
};
