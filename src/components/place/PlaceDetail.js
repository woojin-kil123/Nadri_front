import React, { useEffect, useState } from "react";
import "./place.css";
import axios from "axios";
import StarRating from "../utils/StarRating";
import { useNavigate, useParams } from "react-router-dom";
import ShareIcon from "@mui/icons-material/Share";
import FavoriteBorderIcon from "@mui/icons-material/FavoriteBorder";
import FavoriteIcon from "@mui/icons-material/Favorite";
import Swal from "sweetalert2";
import { useRecoilValue } from "recoil";
import {
  isLoginState,
  loginNicknameState,
  memberLevelState,
} from "../utils/RecoilData";
import Button from "@mui/material/Button";
import TextField from "@mui/material/TextField";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogContentText from "@mui/material/DialogContentText";
import DialogTitle from "@mui/material/DialogTitle";

const PlaceDetail = () => {
  const backServer = process.env.REACT_APP_BACK_SERVER;
  const placeId = useParams().placeId;
  const navigate = useNavigate();

  const isLogin = useRecoilValue(isLoginState);
  const memberNickname = useRecoilValue(loginNicknameState);
  const memberLevel = useRecoilValue(memberLevelState); // 관리자 = 2
  const [place, setPlace] = useState();
  const [editPlace, setEditPlace] = useState({});
  const [editMode, setEditMode] = useState(false);
  const [review, setReview] = useState([]);
  const [bookmarked, setBookmarked] = useState();
  const [viewCount, setViewCount] = useState(0);

  const [open, setOpen] = useState(false); // 모달 오픈 여부 상태

  // 모달 열기
  const handleOpen = () => {
    setOpen(true);
  };
  // 모달 닫기
  const handleClose = () => {
    setOpen(false);
  };
  // 폼 제출 핸들러
  const handleSubmit = (event) => {
    event.preventDefault();

    const formData = new FormData(event.target);
    const formJson = Object.fromEntries(formData.entries());

    console.log("제출 데이터:", formJson);

    // 서버 요청 등 처리 후 모달 닫기
    handleClose();
  };

  useEffect(() => {
    axios
      .get(
        `${backServer}/place/detail?placeId=${placeId}` +
          (isLogin ? `&memberNickname=${memberNickname}` : "")
      )
      .then((res) => {
        setPlace(res.data);
        setEditPlace(res.data); // 수정용 복사
        setBookmarked(res.data.bookmarked);
        setViewCount((prev) => prev + 1);
      });

    axios.post(`${backServer}/place/detail/${placeId}/click`).then((res) => {
      setViewCount(res.data.viewCount);
    });

    axios.get(`${backServer}/review/detail/${placeId}`).then((res) => {
      console.log(res);
      setReview(res.data);
    });
  }, [placeId]);

  const handleHeartClick = (e) => {
    e.stopPropagation();
    if (!isLogin) {
      Swal.fire({
        title: "로그인이 필요합니다",
        icon: "warning",
        text: "로그인 후 좋아하는 장소로 나드리가요!",
        confirmButtonText: "확인",
      }).then(() => navigate("/login"));
    } else {
      handleToggleLike(placeId);
    }
  };

  const handleToggleLike = (placeId) => {
    axios
      .post(`${backServer}/place/bookmark/toggle`, null, {
        params: {
          memberNickname: memberNickname,
          placeId: placeId,
        },
      })
      .then((res) => {
        setBookmarked(res.data);
      });
  };

  const handleCopyLink = () => {
    navigator.clipboard.writeText(window.location.href).then(() => {
      alert("링크가 복사되었습니다!");
    });
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setEditPlace((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSave = () => {
    axios
      .put(`${backServer}/admin/place/update`, editPlace)
      .then(() => {
        alert("수정 완료!");
        setPlace(editPlace);
        setEditMode(false);
      })
      .catch((err) => {
        alert("수정 실패");
        console.log(err);
      });
  };

  return (
    <div className="place-detail-wrap">
      <div className="place-detail-header">
        <div className="detail-header-cat">
          <div>{place?.cat2Name}</div>
          <div>{place?.cat3Name}</div>
        </div>

        <div className="detail-header-title">
          {editMode ? (
            <input
              type="text"
              name="placeTitle"
              value={editPlace.placeTitle || ""}
              onChange={handleChange}
            />
          ) : (
            <h1 className="detail-title">{place?.placeTitle}</h1>
          )}

          {memberLevel == 2 &&
            (editMode ? (
              <div className="edit-button-wrap">
                <button onClick={handleSave}>저장</button>
                <button onClick={() => setEditMode(false)}>취소</button>
              </div>
            ) : (
              <button className="edit-btn" onClick={() => setEditMode(true)}>
                수정하기
              </button>
            ))}
        </div>

        <div className="detail-header-info">
          <div className="review-score">
            {place && <StarRating rating={place.placeRating} />}
            {place?.placeRating}
            {place?.placeReview && ` (${place.placeReview})`}
            {place && <a> {place.areaName},</a>}
            {place && <a> {place.sigunguName}</a>}
          </div>
          <div className="share-like-box">
            <ShareIcon className="share-icon" onClick={handleCopyLink} />
            <div style={{ cursor: "pointer" }}>
              {bookmarked === 1 ? (
                <FavoriteIcon onClick={handleHeartClick} />
              ) : (
                <FavoriteBorderIcon onClick={handleHeartClick} />
              )}
            </div>
          </div>
        </div>
      </div>

      <div className="place-detail-image">
        <div className="placeThumb-box">
          <img
            src={place?.placeThumb || "/image/dora.png"}
            className="detail-img1"
            alt="place"
          />
        </div>
        <div className="placeImage-box-more"></div>
      </div>

      <div className="place-detail-content">
        <div className="main-description">
          <strong>개요</strong>
          {editMode ? (
            <textarea
              name="placeOverview"
              value={editPlace.placeOverview || ""}
              onChange={handleChange}
            />
          ) : (
            <p>
              경복궁은 조선 왕조 제일의 법궁이다. 북으로 북악산을 기대어 자리
              잡았고 정문인 광화문 앞으로는 넓은 육조거리(지금의 세종로)가
              펼쳐져, 왕도인 한양(서울) 도시 계획의 중심이기도 하다. 1395년 태조
              이성계가 창건하였고, 1592년 임진왜란으로 불타 없어졌다가, 고종
              때인 1867년 중건되었다. 흥선대원군이 주도한 중건 경복궁은 500여
              동의 건물들이 미로같이 빼곡히 들어선 웅장한 모습이었다.
            </p>
          )}
        </div>

        <div className="info-box">
          {place?.placeAddr && (
            <div className="info-item">
              <strong>주소</strong>
              {editMode ? (
                <input
                  type="text"
                  name="placeAddr"
                  value={editPlace.placeAddr || ""}
                  onChange={handleChange}
                />
              ) : (
                <p>{place.placeAddr}</p>
              )}
            </div>
          )}

          {place?.placeTel && (
            <div className="info-item">
              <strong>문의 및 안내</strong>
              {editMode ? (
                <input
                  type="text"
                  name="placeTel"
                  value={editPlace.placeTel || ""}
                  onChange={handleChange}
                />
              ) : (
                <p>{place.placeTel}</p>
              )}
            </div>
          )}

          {place?.useTime && (
            <div className="info-item">
              <strong>운영시간</strong>
              {editMode ? (
                <input
                  type="text"
                  name="useTime"
                  value={editPlace.useTime || ""}
                  onChange={handleChange}
                />
              ) : (
                <p>{place.useTime}</p>
              )}
            </div>
          )}

          {place?.restDate && (
            <div className="info-item">
              <strong>쉬는날</strong>
              {editMode ? (
                <input
                  type="text"
                  name="restDate"
                  value={editPlace.restDate || ""}
                  onChange={handleChange}
                />
              ) : (
                <p>{place.restDate}</p>
              )}
            </div>
          )}

          {place?.parking && (
            <div className="info-item">
              <strong>주차</strong>
              {editMode ? (
                <input
                  type="text"
                  name="parking"
                  value={editPlace.parking || ""}
                  onChange={handleChange}
                />
              ) : (
                <p>{place.parking}</p>
              )}
            </div>
          )}

          <div className="info-request-box">
            <span onClick={handleOpen}>잘못된 정보 알려주기</span>
          </div>
        </div>
      </div>

      <div className="place-detail page-title">
        <h2>리뷰</h2>
        <div
          className="review-write btn-primary green"
          onClick={() => {
            navigate(`/review/write/${placeId}`);
          }}
        >
          글쓰기
        </div>
      </div>

      <div className="place-detail review-wap">
        <ul className="posting-wrap">
          {review.map((review, index) => (
            <ReviewItem key={"review-" + index} review={review} />
          ))}
        </ul>
      </div>

      <Dialog open={open} onClose={handleClose}>
        <DialogTitle>정보 수정 요청</DialogTitle>
        <DialogContentText style={{ padding: "0 25px" }}>
          혹시 방문하신 장소의 정보가 다르게 입력되어 있나요? 알려주신다면 확인
          후 반영하여 더 나은 나드리가 되겠습니다. 감사합니다!!^^
        </DialogContentText>
        <form onSubmit={handleSubmit}>
          <DialogContent>
            <TextField
              name="placeTitle"
              label="장소 이름"
              fullWidth
              margin="dense"
              sx={{
                "& label.Mui-focused": {
                  color: "var(--main2)", // 포커스된 라벨 색
                },
                "& .MuiOutlinedInput-root": {
                  "&.Mui-focused fieldset": {
                    borderColor: "var(--main2)", // 포커스된 테두리 색
                  },
                },
              }}
            />
            <TextField
              name="placeAddr"
              label="주소"
              fullWidth
              margin="dense"
              sx={{
                "& label.Mui-focused": {
                  color: "var(--main2)", // 포커스된 라벨 색
                },
                "& .MuiOutlinedInput-root": {
                  "&.Mui-focused fieldset": {
                    borderColor: "var(--main2)", // 포커스된 테두리 색
                  },
                },
              }}
            />
            <TextField
              name="placeAddr"
              label="문의 및 안내"
              fullWidth
              margin="dense"
              sx={{
                "& label.Mui-focused": {
                  color: "var(--main2)", // 포커스된 라벨 색
                },
                "& .MuiOutlinedInput-root": {
                  "&.Mui-focused fieldset": {
                    borderColor: "var(--main2)", // 포커스된 테두리 색
                  },
                },
              }}
            />
            <TextField
              name="placeAddr"
              label="운영시간"
              fullWidth
              margin="dense"
              sx={{
                "& label.Mui-focused": {
                  color: "var(--main2)", // 포커스된 라벨 색
                },
                "& .MuiOutlinedInput-root": {
                  "&.Mui-focused fieldset": {
                    borderColor: "var(--main2)", // 포커스된 테두리 색
                  },
                },
              }}
            />
            <TextField
              name="placeAddr"
              label="쉬는날"
              fullWidth
              margin="dense"
              sx={{
                "& label.Mui-focused": {
                  color: "var(--main2)", // 포커스된 라벨 색
                },
                "& .MuiOutlinedInput-root": {
                  "&.Mui-focused fieldset": {
                    borderColor: "var(--main2)", // 포커스된 테두리 색
                  },
                },
              }}
            />
            <TextField
              name="placeAddr"
              label="주차"
              fullWidth
              margin="dense"
              sx={{
                "& label.Mui-focused": {
                  color: "var(--main2)", // 포커스된 라벨 색
                },
                "& .MuiOutlinedInput-root": {
                  "&.Mui-focused fieldset": {
                    borderColor: "var(--main2)", // 포커스된 테두리 색
                  },
                },
              }}
            />
          </DialogContent>
          <DialogActions>
            <Button
              onClick={handleClose}
              sx={{
                backgroundColor: "white",
                color: "var(--main2)",
                "&:hover": { backgroundColor: "#efefef" },
              }}
            >
              취소
            </Button>
            <Button
              type="submit"
              variant="contained"
              sx={{
                backgroundColor: "var(--main2)",
                color: "white",
                "&:hover": { backgroundColor: "var(--main3)" },
              }}
            >
              저장
            </Button>
          </DialogActions>
        </form>
      </Dialog>
    </div>
  );
};

const ReviewItem = ({ review }) => {
  const navigate = useNavigate();
  return (
    <li
      className="posting-item"
      onClick={() => {
        navigate(`/review/detail/${review.reviewNo}`);
      }}
    >
      <div className="posting-info">
        <div>
          <StarRating rating={review.starRate} />
        </div>
        <div className="posting-title">{review.reviewTitle}</div>
        <div
          dangerouslySetInnerHTML={{
            __html: review.reviewContent,
          }}
        />
        <div className="posting-sub-info">
          <span>{review.memberNickname}</span>
          <span>{review.reviewDate}</span>
        </div>
      </div>
    </li>
  );
};

export default PlaceDetail;
