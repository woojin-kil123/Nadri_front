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
  const [content, setContent] = useState("");
  const [files, setFiles] = useState([]);
  const [filePreviews, setFilePreviews] = useState([]);
  const [placeInfo, setPlaceInfo] = useState({});
  const [memberNickname] = useRecoilState(loginNicknameState);
  const navigate = useNavigate();

  useEffect(() => {
    axios
      .get(
        `${process.env.REACT_APP_BACK_SERVER}/place/detail?placeId=${placeId}`
      )
      .then((res) => setPlaceInfo(res.data))
      .catch((err) => console.log(err));
  }, [placeId]);

  const fileChange = (e) => {
    const newFiles = Array.from(e.target.files);
    const combinedFiles = [...files, ...newFiles];
    setFiles(combinedFiles);
    const newPreviews = newFiles.map((file) => URL.createObjectURL(file));
    setFilePreviews((prev) => [...prev, ...newPreviews]);
  };

  const removeImage = (indexToRemove) => {
    setFiles((prev) => prev.filter((_, idx) => idx !== indexToRemove));
    setFilePreviews((prev) => prev.filter((_, idx) => idx !== indexToRemove));
  };

  const submitReview = () => {
    if (!title || !content) {
      alert("제목과 내용을 모두 입력해주세요.");
      return;
    }

    const form = new FormData();
    form.append("placeId", placeId);
    form.append("reviewTitle", title);
    form.append("memberNickname", memberNickname);
    form.append("placeTypeId", placeInfo.placeTypeId);
    form.append("starRate", rating);
    form.append("reviewContent", content);
    files.forEach((file) => form.append("files", file));

    axios
      .post(`${process.env.REACT_APP_BACK_SERVER}/review`, form, {
        headers: { "Content-Type": "multipart/form-data" },
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
    <section className="section review-write-section">
      {/* 왼쪽 - 장소 카드 */}
      <div className="review-left">
        <h2 className="page-title2">방문하신 시설은 만족스러우셨나요?</h2>
        <div className="place-card">
          <img
            src={placeInfo.placeThumb || "/image/default_img.png"}
            alt="장소 이미지"
            className="review-image"
          />
          <div className="place-info-text">
            <h3 className="place-title">
              {placeInfo.placeTitle || "이름 없음"}
            </h3>
            <p className="place-addr">
              {placeInfo.placeAddr || "위치 정보 없음"}
            </p>
          </div>
        </div>
      </div>

      {/* 오른쪽 - 리뷰 작성 폼 */}
      <div className="review-form">
        <div className="form-section">
          <label className="form-label">귀하의 경험에 대해 평가해주세요</label>
          <StarRating rating={rating} setRating={setRating} />
        </div>

        <div className="form-section">
          <label className="form-label">리뷰 쓰기</label>
          <TextEditor data={content} setData={setContent} />
        </div>

        <div className="form-section">
          <label className="form-label">제목</label>
          <input
            type="text"
            className="form-input"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="경험했던 것 중 가장 중요한 정보를 알려주세요"
          />
        </div>

        <div className="form-section">
          <label className="form-label">사진 추가하기</label>

          <label className="upload-box" htmlFor="filePath">
            클릭하여 사진 추가하기
            <br />
            <span>또는 끌어놓기</span>
          </label>

          <input
            type="file"
            id="filePath"
            style={{ display: "none" }}
            multiple
            onChange={fileChange}
          />

          <div className="image-preview">
            {filePreviews.map((src, idx) => (
              <img
                key={idx}
                src={src}
                alt={`preview-${idx}`}
                onClick={() => removeImage(idx)}
                className="preview-image"
              />
            ))}
          </div>
        </div>

        <button className="submit-button" onClick={submitReview}>
          리뷰 제출
        </button>
      </div>
    </section>
  );
};

// 별점 컴포넌트
const StarRating = ({ totalStars = 5, rating, setRating }) => {
  return (
    <div className="star-rating">
      {[...Array(totalStars)].map((_, index) => (
        <span
          key={index}
          className={`star-icon ${index < rating ? "filled" : ""}`}
          onClick={() => setRating(index + 1)}
        >
          {index < rating ? <StarRateIcon /> : <StarOutlineIcon />}
        </span>
      ))}
    </div>
  );
};

export default ReviewWrite;
