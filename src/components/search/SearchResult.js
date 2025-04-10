import { useLocation, useParams } from "react-router-dom";
import { useRecoilValue } from "recoil";
import { placeTypeState } from "../utils/RecoilData";
import { useEffect, useState } from "react";
import axios from "axios";

const SearchResult = () => {
  const location = useLocation();
  const queryParams = new URLSearchParams(location.search);
  const [query, setQuery] = useState("");
  const [typeId, setTypeId] = useState([]);
  const placeType = useRecoilValue(placeTypeState);
  useEffect(() => {
    setQuery(queryParams.get("query"));
    setTypeId(queryParams.getAll("type"));
  }, [location]);
  useEffect(() => {
    axios.get(
      `${process.env.REACT_APP_BACK_SERVER}/search?query=${queryParams}&type=${placeType[0].id}`
    );
  }, [query, typeId]);
  return (
    <>
      <h1>{query ? `${query}` : ""} 검색결과</h1>
      <section className="section">
        {typeId.map((type, i) => (
          <div key={`type${i}`} className="search-result">
            <h2>{placeType.find((item, i) => item.id == type)?.name}</h2>
          </div>
        ))}
      </section>
    </>
  );
};
export default SearchResult;
