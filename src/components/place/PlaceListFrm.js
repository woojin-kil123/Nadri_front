import axios from "axios";
import { useEffect, useState } from "react";
import ListCard from "../utils/ListCard";

const PlaceListFrm = ({ placeTypeId, placeList, pi }) => {
  const [cards, setCards] = useState([]);

  useEffect(() => {
    // 아직 백엔드가 없음!!!
    axios
      .get(`${process.env.REACT_APP_BACK_SERVER}/place/spot?reqPage=1`)
      .then((res) => {
        console.log(res);
        setCards(res.data.list);
      })
      .catch((err) => {
        console.log(err);
      });
  }, []);

  return (
    <div>
      <h2>총 {placeList.length}개 항목</h2>
      <div className="place-list">
        {placeList.map((place) => (
          <ul className="place-card" key={place.placeId}>
            {/* {cards.map((card, i) => (
              <ListCard key={"card-" + i} place={card} />
            ))} */}
          </ul>
        ))}
      </div>
      {/* pi를 이용한 페이지네이션 넣어야*/}
    </div>
  );
};

export default PlaceListFrm;
