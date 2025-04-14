import axios from "axios";
import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import TextEditor from "../utils/Texteditor";
import StarOutlineIcon from "@mui/icons-material/StarOutline";
import StarRateIcon from "@mui/icons-material/StarRate";

const EditReview = () => {
  const reviewNo = useParams().reviewNo;

  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [rating, setRating] = useState(0);
  const [files, setFiles] = useState([]);
  const [filePreviews, setFilePreviews] = useState([]);

  const navigate = useNavigate();

  useEffect(() => {
    axios
      .get(`${process.env.REACT_APP_BACK_SERVER}/review/${reviewNo}`)
      .then((res) => {
        console.log(res);
        setTitle(res.data.reviewTitle);
        setContent(res.data.reviewContent);
        setRating(res.data.starRate);
        // 기존 이미지 미리보기를 위해 필요시 여기서 불러오기 추가 가능
      })
      .catch((err) => console.log(err));
  }, [reviewNo]);
  useEffect(() => {
    if (reviewNo) {
      axios
        .get(
          `${process.env.REACT_APP_BACK_SERVER}/review/reviewImage?reviewNo=${reviewNo}`
        )
        .then((res) => {
          console.log(res);
          setFiles(res.data); // res.data는 PlaceImgDTO 리스트여야 함
          setFilePreviews(res.data);
        })
        .catch((err) => {
          console.log("리뷰 이미지 불러오기 실패:", err);
        });
    }
  }, []);
  const fileChange = (e) => {
    const selectedFiles = Array.from(e.target.files);
    setFiles(selectedFiles);

    const previews = selectedFiles.map((file) => URL.createObjectURL(file));
    setFilePreviews(previews);
  };

  const removeImage = (index) => {
    const newFiles = [...files];
    const newPreviews = [...filePreviews];
    newFiles.splice(index, 1);
    newPreviews.splice(index, 1);
    setFiles(newFiles);
    setFilePreviews(newPreviews);
  };

  const reviewEdit = () => {
    if (!title || !content) {
      alert("제목과 내용을 모두 입력해주세요.");
      return;
    }

    const form = new FormData();
    form.append("reviewNo", reviewNo);
    form.append("reviewTitle", title);
    form.append("starRate", rating);
    form.append("reviewContent", content);

    files.forEach((file) => {
      form.append("multipartFile", file); // 백엔드 필드 이름에 맞게 조정
    });

    axios
      .patch(`${process.env.REACT_APP_BACK_SERVER}/review`, form, {
        headers: { "Content-Type": "multipart/form-data" },
      })
      .then((res) => {
        console.log(res);
        alert("리뷰가 성공적으로 수정되었습니다!");
        navigate("/review");
      })
      .catch((err) => {
        console.log(err);
        alert("리뷰 수정에 실패했습니다.");
      });
  };

  return (
    <section className="section review-write-section">
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

        {/* 이미지 업로드 영역 */}
        <div className="form-section" style={{ marginTop: "50px" }}>
          <label className="form-label">사진 추가하기</label>
          <div className="upload-preview-wrapper">
            <label className="upload-box" htmlFor="filePath">
              클릭하여 사진 추가하기
              <br />
              <span>또는 끌어놓기</span>
              <input
                type="file"
                id="filePath"
                style={{ display: "none" }}
                multiple
                onChange={fileChange}
              />
            </label>
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
        </div>

        <button className="submit-button" onClick={reviewEdit}>
          리뷰수정
        </button>
      </div>
    </section>
  );
};

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

export default EditReview;
