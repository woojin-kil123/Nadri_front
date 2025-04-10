import { useState, useEffect } from "react";
import TextEditor from "../utils/Texteditor";
import StarOutlineIcon from "@mui/icons-material/StarOutline";
import StarRateIcon from "@mui/icons-material/StarRate";
import { useNavigate, useParams } from "react-router-dom";
import axios from "axios";
import { useRecoilState } from "recoil";
import { loginNicknameState } from "../utils/RecoilData";
const ReviewWrite = () => {
  const placeId = useParams().placeId;
  const [rating, setRating] = useState(0);
  const [title, setTitle] = useState("");
  const [files, setFiles] = useState([]);
  const [filePreviews, setFilePreviews] = useState([]);
  const [content, setContent] = useState("");
  const [placeInfo, setPlaceInfo] = useState({});
  const [memberNickname, setMemberNickname] =
    useRecoilState(loginNicknameState);
  const navigate = useNavigate();
  //파일 첨부
  const fileChange = (e) => {
    const newFiles = Array.from(e.target.files);
    const combinedFiles = [...files, ...newFiles];
    setFiles(combinedFiles);
    const newPreviews = newFiles.map((file) => URL.createObjectURL(file));
    setFilePreviews((prev) => [...prev, ...newPreviews]);
  };
  //파일 삭제
  const removeImage = (indexToRemove) => {
    setFiles((prev) => prev.filter((_, idx) => idx !== indexToRemove));
    setFilePreviews((prev) => prev.filter((_, idx) => idx !== indexToRemove));
  };
  //여행지 정보
  useEffect(() => {
    axios
      .get(`${process.env.REACT_APP_BACK_SERVER}/review/placeinfo/${placeId}`)
      .then((res) => {
        console.log(res);
        setPlaceInfo(res.data);
      })
      .catch((err) => {
        console.error("여행지 정보 로드 실패:", err);
      });
  }, [placeId]);

  //폼 재출
  const submitReview = () => {
    if (!title || !content) {
      alert("제목과 내용을 모두 입력해주세요.");
      return;
    }
    const placeTypeId = placeInfo.placeTypeId;
    const form = new FormData();
    form.append("placeId", placeId);
    form.append("reviewTitle", title);
    form.append("memberNickname", memberNickname);
    form.append("placeTypeId", placeTypeId);
    form.append("starRate", rating);
    form.append("reviewContent", content);
    for (let i = 0; i < files.length; i++) {
      form.append("files", files[i]);
    }
    console.log(form);
    axios
      .post(`${process.env.REACT_APP_BACK_SERVER}/review`, form, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      })
      .then(() => {
        alert("리뷰가 성공적으로 등록되었습니다!");
        navigate("/review");
      })
      .catch((error) => {
        console.error("리뷰 등록 실패:", error);
        alert("리뷰 등록에 실패했습니다.");
      });
  };
  return (
    <section className="section">
      <div className="review-container">
        {/* 여행지 정보 */}
        <aside className="place-info">
          <div>방문하신 시설은 마음에 드셨나요?</div>

          <img
            src={placeInfo.placeThumb || "/image/default_img.png"}
            className="place-image"
            alt="place"
          />
          <div className="place-details">
            <h3>{placeInfo.placeTitle || "이름 없음"}</h3>
            <p>{placeInfo.placeAddr || "위치 정보 없음"}</p>
          </div>
        </aside>
        <div className="review-form">
          <table className="tbl">
            <tbody>
              <tr>
                <th>
                  <label>평점</label>
                </th>
                <td>
                  <div>당신의 경험을 평가해주세요</div>
                  <StarRating rating={rating} setRating={setRating} />
                </td>
              </tr>
              <tr>
                <th>
                  <label>제목</label>
                </th>
                <td>
                  <div className="input-item">
                    <input
                      type="text"
                      value={title}
                      onChange={(e) => setTitle(e.target.value)}
                    ></input>
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
                      onChange={fileChange}
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
                    {filePreviews.map((src, idx) => (
                      <img
                        key={idx}
                        src={src}
                        alt={`preview-${idx}`}
                        onClick={() => removeImage(idx)}
                        style={{
                          width: "100px",
                          marginRight: "10px",
                          cursor: "pointer",
                        }}
                      />
                    ))}
                  </div>
                </td>
              </tr>
            </tbody>
          </table>
          <div className="text-zone">
            <TextEditor data={content} setData={setContent} />
          </div>
        </div>
      </div>
      <button className="btn-primary" onClick={submitReview}>
        작성
      </button>
    </section>
  );
};
const StarRating = ({ totalStars = 5, rating, setRating }) => {
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
export default ReviewWrite;
