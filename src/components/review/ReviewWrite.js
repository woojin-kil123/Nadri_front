import { useState } from "react";
import TextEditor from "../utils/Texteditor";
import StarOutlineIcon from "@mui/icons-material/StarOutline";
import StarRateIcon from "@mui/icons-material/StarRate";
const StarRating = ({ totalStars = 5 }) => {
  const [rating, setRating] = useState(0);

  const handleRating = (index) => {
    setRating(index + 1);
  };

  return (
    <div className="rate">
      {[...Array(totalStars)].map((_, index) => (
        <div key={index} onClick={() => handleRating(index)}>
          {index < rating ? <StarRateIcon /> : <StarOutlineIcon />}
        </div>
      ))}
    </div>
  );
};

const ReviewWrite = () => {
  return (
    <section className="section">
      <table className="tbl">
        <tbody>
          <tr>
            <th>
              <label>평점</label>
            </th>
            <td>
              <div>당신의 경험을 평가해주세요</div>
              <StarRating />
            </td>
          </tr>
          <tr>
            <th>
              <label>제목</label>
            </th>
            <td>
              <div className="input-item">
                <input type="text"></input>
              </div>
            </td>
          </tr>
          <tr>
            <th>
              <label>첨부파일</label>
            </th>
            <td>
              <label className="btn-primary green" htmlFor="filePath">
                파일첨부
              </label>
              <div className="input-item">
                <input
                  type="file"
                  id="filePath"
                  style={{ display: "none" }}
                  multiple
                ></input>
              </div>
            </td>
          </tr>
          <tr>
            <th>
              <label>첨부파일리스트</label>
            </th>
            <td>
              <div className="input-item">
                <img src="/image/default_img.png"></img>
              </div>
            </td>
          </tr>
        </tbody>
      </table>
      <div className="text-zone">
        <TextEditor />
      </div>
    </section>
  );
};
export default ReviewWrite;
