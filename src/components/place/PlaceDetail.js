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

  const [form, setForm] = useState({
    placeId: placeId,
    placeTitle: "",
    placeAddr: "",
    placeTel: "",
  });

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
    axios.post(`${backServer}/admin/place/request`, form).then(() => {
      Swal.fire({
        title: "수정 요청 완료",
        icon: "success",
        text: "감사합니다! 더 정확한 나드리가 되겠습니다.",
        confirmButtonText: "확인",
      });
      handleClose();
    });
  };

  const [placeImages, setPlaceIamges] = useState([]);

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

    axios
      .get(`${backServer}/place/images/${placeId}`)
      .then((res) => {
        setPlaceIamges(res.data);
      })
      .catch((err) => console.error("이미지 불러오기 실패", err));

    axios.post(`${backServer}/place/detail/${placeId}/click`).then((res) => {
      setViewCount(res.data.viewCount);
    });

    axios.get(`${backServer}/review/detail/${placeId}`).then((res) => {
      setReview(res.data);
    });
  }, [placeId]);

  const [overviewLoading, setOverviewLoading] = useState(false);

  useEffect(() => {
    if (!place?.placeOverview && place?.placeId && !overviewLoading) {
      setOverviewLoading(true); // 요청 1회만 수행

      axios
        .get(`${backServer}/place/overview/fetch?placeId=${place.placeId}`)
        .then((res) => {
          setPlace((prev) => ({
            ...prev,
            placeOverview: res.data.placeOverview,
          }));
        })
        .catch((err) => {
          console.error(" 개요 가져오기 실패:", err);
        });
    }
  }, [placeId, overviewLoading]);

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

  //공유버튼 -> 링크복사 함수
  const handleCopyLink = () => {
    navigator.clipboard.writeText(window.location.href).then(() => {
      Swal.fire({
        title: "링크 복사 완료",
        icon: "success",
        text: "이 장소의 링크가 복사되었습니다!",
        confirmButtonText: "확인",
      });
    });
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setEditPlace((prev) => ({
      ...prev,
      [name]: value,
    }));
  };
  const handleRequestChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  //상세페이지 수정 후 저장
  const handleSave = () => {
    console.log(editPlace);
    axios
      .patch(`${backServer}/admin/place/update`, editPlace)
      .then(() => {
        Swal.fire({
          title: "수정 완료",
          icon: "success",
          text: "수정을 완료하였습니다.",
          confirmButtonText: "확인",
        });
        setPlace(editPlace);
        setEditMode(false);
      })
      .catch((err) => {
        Swal.fire({
          title: "수정 실패",
          icon: "warning",
          text: "수정을 실패하였습니다.",
          confirmButtonText: "확인",
        });
        console.log(err);
      });
  };

  //이미지(썸네일 제외) 삭제용 함수
  const handleImageDelete = (placeImageNo) => {
    if (window.confirm("정말 이미지를 삭제하시겠습니까?")) {
      axios
        .delete(`${backServer}/admin/place/image/${placeImageNo}`)
        .then(() => {
          // 삭제 성공 시 상태에서 제거
          setPlaceIamges((prev) =>
            prev.filter((img) => img.placeImageNo !== placeImageNo)
          );
        })
        .catch((err) => {
          console.error("이미지 삭제 실패", err);
          Swal.fire({
            title: "수정 실패",
            icon: "warning",
            text: "수정을 실패하였습니다.",
            confirmButtonText: "확인",
          });
        });
    }
  };

  if (!place) return null;
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
              <div className="place-detail edit-button-wrap">
                <button className="btn-primary" onClick={handleSave}>
                  저장
                </button>
                <button
                  className="btn-secondary"
                  onClick={() => setEditMode(false)}
                >
                  취소
                </button>
              </div>
            ) : (
              <button
                className="btn-primary edit-btn"
                onClick={() => setEditMode(true)}
              >
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
            src={
              place?.placeThumb ||
              (place?.placeTypeId === 12
                ? "/image/default_spot.png"
                : place.placeTypeId === 14
                ? "/image/default_todo.png"
                : place.placeTypeId === 32
                ? "/image/default_stay.png"
                : place.placeTypeId === 39
                ? "/image/default_food.png"
                : "/image/default_thumb.png")
            }
            className="detail-img-main"
            alt="main"
          />
        </div>

        <div className="placeImage-more-box">
          <div className="placeImage-more">
            {placeImages[0] && (
              <div className="img-wrap">
                <img
                  src={`${backServer}/assets/place/image/${placeImages[0].filepath}`}
                  className="detail-img"
                  alt="img2"
                />
                {editMode && memberLevel === 2 && (
                  <button
                    className="img-delete-btn"
                    onClick={() =>
                      handleImageDelete(placeImages[0].placeImageNo)
                    }
                  >
                    ✕
                  </button>
                )}
              </div>
            )}
            {placeImages[2] && (
              <div className="img-wrap">
                <img
                  src={`${backServer}/assets/place/image/${placeImages[2].filepath}`}
                  className="detail-img"
                  alt="img3"
                />
                {editMode && memberLevel === 2 && (
                  <button
                    className="img-delete-btn"
                    onClick={() =>
                      handleImageDelete(placeImages[0].placeImageNo)
                    }
                  >
                    ✕
                  </button>
                )}
              </div>
            )}
          </div>
          <div className="placeImage-more">
            {placeImages[1] && (
              <div className="img-wrap">
                <img
                  src={`${backServer}/assets/place/image/${placeImages[1].filepath}`}
                  className="detail-img"
                  alt="img4"
                />
                {editMode && memberLevel === 2 && (
                  <button
                    className="img-delete-btn"
                    onClick={() =>
                      handleImageDelete(placeImages[0].placeImageNo)
                    }
                  >
                    ✕
                  </button>
                )}
              </div>
            )}
            {placeImages[3] && (
              <div className="img-wrap">
                <img
                  src={`${backServer}/assets/place/image/${placeImages[3].filepath}`}
                  className="detail-img"
                  alt="img5"
                />
                {editMode && memberLevel === 2 && (
                  <button
                    className="img-delete-btn"
                    onClick={() =>
                      handleImageDelete(placeImages[0].placeImageNo)
                    }
                  >
                    ✕
                  </button>
                )}
              </div>
            )}
          </div>
        </div>
      </div>

      <div className="place-detail-content">
        {place && (
          <div className="main-description">
            <strong>개요</strong>
            {editMode ? (
              <textarea
                className="place-overview-textarea"
                name="placeOverview"
                value={editPlace.placeOverview ?? ""}
                onChange={handleChange}
              />
            ) : place.placeOverview ? (
              <p>{place.placeOverview}</p>
            ) : (
              <p>개요 정보를 불러오는 중입니다...</p>
            )}
          </div>
        )}

        <div className="info-box">
          {place?.placeAddr && (
            <div className="info-item">
              <strong>주소</strong>
              <p>{place.placeAddr}</p>
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

          <div className="info-request-box">
            <span onClick={handleOpen}>잘못된 정보 알려주기</span>
          </div>
        </div>
      </div>

      <div className="place-detail page-title">
        <h2>리뷰</h2>
        <div
          className="btn-primary review-write "
          onClick={() => {
            navigate(`/review/write/${placeId}`);
          }}
        >
          리뷰작성
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
              onChange={handleRequestChange}
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
              onChange={handleRequestChange}
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
              name="placeTel"
              label="문의 및 안내(연락처)"
              fullWidth
              margin="dense"
              onChange={handleRequestChange}
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
              전송
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
