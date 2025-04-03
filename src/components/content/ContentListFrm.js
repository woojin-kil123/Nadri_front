import axios from "axios";
import { useEffect, useState } from "react";
import ListCard from "../utils/ListCard";

const ContentListFrm = ({ contentTypeId, contentList, pi }) => {
  const [cards, setCards] = useState([]);
  useEffect(() => {
    //아직 백엔드가 없음!!!
    axios
      .get(
        `${process.env.REACT_APP_BACK_SERVER}/content/${contentTypeId}?reqPage=1&`
      )
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
      <h2>총 {contentList.length}개 항목</h2>
      <div className="content-list">
        {contentList.map((content) => (
          <ul className="content-card" key={content.contentId}>
            {cards.map((card, i) => (
              <ListCard key={"card-" + i} content={card} />
            ))}
          </ul>
        ))}
      </div>
      {/* TODO: pi를 이용한 페이지네이션 넣을 수 있음 */}
    </div>
  );
};

export default ContentListFrm;
