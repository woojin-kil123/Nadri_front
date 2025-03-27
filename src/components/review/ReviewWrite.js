import TextEditor from "../utils/Texteditor";
import StarOutlineIcon from "@mui/icons-material/StarOutline";
import StarRateIcon from "@mui/icons-material/StarRate";
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
              <div>
                <StarOutlineIcon></StarOutlineIcon>
                <StarOutlineIcon></StarOutlineIcon>
                <StarOutlineIcon></StarOutlineIcon>
                <StarOutlineIcon></StarOutlineIcon>
                <StarOutlineIcon></StarOutlineIcon>
              </div>
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
              <label className="btn-primary green">파일첨부</label>
              <div className="input-item">
                <input type="file" style={{ display: "none" }} multiple></input>
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
