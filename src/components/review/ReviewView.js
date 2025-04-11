import { useNavigate, useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import "./review.css";
import FavoriteBorderIcon from "@mui/icons-material/FavoriteBorder";
import FavoriteIcon from "@mui/icons-material/Favorite";
import DeleteIcon from "@mui/icons-material/Delete";
import ReportIcon from "@mui/icons-material/Report";
import EditNoteIcon from "@mui/icons-material/EditNote";
import axios from "axios";
import Swal from "sweetalert2";
import { useRecoilState } from "recoil";
import { loginNicknameState } from "../utils/RecoilData";
import EditIcon from "@mui/icons-material/Edit";

const ReviewView = () => {
  const params = useParams();
  const reviewNo = params.reviewNo;
  const [comments, setComments] = useState([]);
  const [newComment, setNewComment] = useState("");
  const [placeId, setPlaceId] = useState(0);
  const [reviewImages, setReviewImages] = useState([]);
  const navigate = useNavigate();
  const [isCommenting, setIsCommenting] = useState(false);
  const REPORT_REASONS = [
    "부적절한 콘텐츠 – 욕설, 비방, 혐오 발언 등이 포함된 리뷰",
    "허위 정보 – 실제 방문하지 않았거나, 거짓 정보를 포함한 리뷰",
    "광고/스팸 – 특정 업체 홍보나 광고 목적으로 작성된 리뷰",
    "부적절한 이미지 – 폭력적이거나 선정적인 이미지가 포함된 경우",
    "리뷰와 무관한 내용 – 여행지와 관련 없는 내용이 포함된 경우",
  ];
  const [memberNickname, setMemberNickname] =
    useRecoilState(loginNicknameState);
  const [placeInfo, setPlaceInfo] = useState({});
  const [member, setMember] = useState(null);
  //개인정보 저장
  useEffect(() => {
    axios
      .get(
        `${process.env.REACT_APP_BACK_SERVER}/member/memberInfo?memberNickname=${memberNickname}`
      )
      .then((res) => {
        console.log(res);
        setMember(res.data);
      })
      .catch((err) => {
        console.log(err);
      });
  }, [memberNickname]);
  //댓글 수정
  const editComment = (commNo) => {
    const targetComment = comments.find((comment) => comment.commNo === commNo);
    if (!targetComment) return;

    Swal.fire({
      title: "댓글 수정",
      input: "text",
      inputLabel: "수정할 내용을 입력하세요",
      inputPlaceholder: "댓글 내용을 입력하세요",
      inputValue: targetComment.commContent,
      showCancelButton: true,
      confirmButtonText: "수정하기",
      cancelButtonText: "취소",
      inputValidator: (value) => {
        if (!value) {
          return "수정할 내용을 입력해주세요.";
        }
      },
    }).then((result) => {
      if (result.isConfirmed) {
        const editedContent = result.value;
        console.log(commNo);
        axios
          .patch(`${process.env.REACT_APP_BACK_SERVER}/comm/${commNo}`, {
            commContent: editedContent,
          })
          .then((res) => {
            console.log(res);
            if (res.data === 1) {
              const updatedComments = comments.map((comment) =>
                comment.commNo === commNo
                  ? { ...comment, commContent: editedContent }
                  : comment
              );

              setComments(updatedComments);
            }
          })
          .catch((err) => {
            console.log(err);
          });
      }
    });
  };
  //댓글 삭제
  const deleteComment = (commNo) => {
    Swal.fire({
      title: "댓글 삭제",
      text: "삭제하시겠습니까",
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: "삭제하기",
      cancelButtonText: "취소",
    }).then((res) => {
      if (res.isConfirmed) {
        axios
          .delete(`${process.env.REACT_APP_BACK_SERVER}/comm/${commNo}`)
          .then((res) => {
            if (res.data === 1) {
              const newComments = comments.filter(
                (comment) => comment.commNo !== commNo
              );
              setComments(newComments);
            }
          })
          .catch((err) => {
            console.log(err);
          });
      }
    });
  };
  const [liked, setLiked] = useState(false);
  const [likeCount, setLikeCount] = useState(0);
  const [review, setReview] = useState({});
  //좋아요 불러오기
  useEffect(() => {
    axios
      .get(`${process.env.REACT_APP_BACK_SERVER}/likes/${reviewNo}`)
      .then((res) => {
        setLikeCount(res.data.likes);
        if (res.data.likeMember.memberNickname === memberNickname) {
          setLiked(true);
        }
      })
      .catch((err) => {
        console.log(err);
      });
  }, []);
  //좋아요 기능 구현
  const toggleLike = () => {
    if (!memberNickname) {
      alert("로그인 후 좋아요를 누를 수 있습니다.");
      return;
    }
    if (liked) {
      axios
        .delete(`${process.env.REACT_APP_BACK_SERVER}/likes/${reviewNo}`, {
          data: { memberNickname },
        })
        .catch((err) => console.log(err));
    } else {
      const form = new FormData();
      form.append("reviewNo", reviewNo);
      form.append("memberNickname", memberNickname);
      axios
        .post(`${process.env.REACT_APP_BACK_SERVER}/likes`, form)
        .catch((err) => console.log(err));
    }
    setLiked(!liked);
    setLikeCount((prev) => (liked ? prev - 1 : prev + 1));
  };

  //리뷰 삭제
  const deleteReview = () => {
    Swal.fire({
      title: "리뷰 삭제",
      text: "삭제하시겠습니까",
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: "삭제하기",
      cancelButtonText: "취소",
    }).then((res) => {
      if (res.isConfirmed) {
        axios
          .delete(`${process.env.REACT_APP_BACK_SERVER}/review/${reviewNo}`)
          .then(() => navigate("/review"))
          .catch((err) => console.log(err));
      }
    });
  };

  const [isReporting, setIsReporting] = useState(false);
  const [reportReason, setReportReason] = useState("");
  const [reportTarget, setReportTarget] = useState(null);

  const editReview = () => {
    navigate(`/review/edit/${reviewNo}`);
  };

  const reportClick = (target) => {
    setReportTarget(target);
    setIsReporting(true);
  };

  const reportSubmit = () => {
    if (!reportReason) {
      alert("신고 사유를 선택해주세요.");
      return;
    }

    const reportData = {
      reviewNo: reviewNo,
      reportNickname: memberNickname,
      reportReason: reportReason,
    };

    axios
      .post(`${process.env.REACT_APP_BACK_SERVER}/report/`, reportData)
      .then(() => {
        alert(`"${reportReason}" 사유로 신고되었습니다.`);
      })
      .catch((err) => console.log(err));

    setIsReporting(false);
    setReportReason("");
    setReportTarget(null);
  };

  useEffect(() => {
    axios
      .get(`${process.env.REACT_APP_BACK_SERVER}/review/${reviewNo}`)
      .then((res) => {
        setReview(res.data);
        setPlaceId(res.data.placeId);
      })
      .catch((err) => console.log(err));
  }, []);

  //여행지 정보
  useEffect(() => {
    if (placeId !== 0) {
      axios
        .get(
          `${process.env.REACT_APP_BACK_SERVER}/place/detail?placeId=${placeId}`
        )
        .then((res) => {
          console.log(res);
          setPlaceInfo(res.data);
        })
        .catch((err) => {
          console.log(err);
        });
    }
  }, [placeId]);

  useEffect(() => {
    axios
      .get(`${process.env.REACT_APP_BACK_SERVER}/comm/${reviewNo}`)
      .then((res) => setComments(res.data))
      .catch((err) => console.log(err));
  }, []);
  // 사진 있으면 불러오기
  useEffect(() => {
    if (review.reviewNo) {
      axios
        .get(
          `${process.env.REACT_APP_BACK_SERVER}/review/reviewImage?reviewNo=${review.reviewNo}`
        )
        .then((res) => {
          setReviewImages(res.data); // res.data는 PlaceImgDTO 리스트여야 함
        })
        .catch((err) => {
          console.log("리뷰 이미지 불러오기 실패:", err);
        });
    }
  }, [review]);

  return (
    <section className="section review-view-section">
      <div className="page-title">리뷰 상세보기</div>

      <div className="review-card">
        {/* 장소 정보 */}
        <div className="place-info">
          <h2>{placeInfo.placeTitle}</h2>
          <p>{placeInfo.placeAddr}</p>
        </div>

        {/* 리뷰 정보 */}
        <div className="review-header">
          <h3 className="review-title">{review.reviewTitle}</h3>
          <div className="review-meta">
            <span className="author">{review.memberNickname}</span>
            <span className="date">{review.reviewDate}</span>
          </div>
        </div>

        {/* 본문 내용 */}

        <div
          className="review-body"
          dangerouslySetInnerHTML={{
            __html: review.reviewContent, // p 태그 제거
          }}
        />
        {/* 첨부 이미지 표시 */}
        {reviewImages.length > 0 && (
          <div className="review-images">
            {reviewImages.map((img, index) => (
              <div className="review-image-wrapper">
                <img
                  key={index}
                  src={`${process.env.REACT_APP_BACK_SERVER}/place/${img.filepath}`}
                  alt=""
                  className="review-image"
                />
              </div>
            ))}
          </div>
        )}
        {/* 좋아요, 수정, 삭제, 신고 */}
        <div className="review-actions">
          <button
            onClick={toggleLike}
            className="like-button"
            style={{ background: "none", border: "none" }}
          >
            {liked ? <FavoriteIcon color="error" /> : <FavoriteBorderIcon />}
          </button>
          <span>{likeCount}</span>

          {memberNickname === review.memberNickname && (
            <>
              <EditNoteIcon
                onClick={editReview}
                style={{ cursor: "pointer" }}
              />
              <DeleteIcon
                onClick={deleteReview}
                style={{ cursor: "pointer", marginLeft: "10px" }}
              />
            </>
          )}
          {review.memberNickname !== memberNickname && (
            <ReportIcon
              onClick={reportClick}
              style={{ cursor: "pointer", marginLeft: "10px" }}
            />
          )}
        </div>
      </div>
      <div className="comment-wrap">
        <h3>댓글</h3>
        <ul>
          {comments.map((comment) => (
            <CommentItem
              key={comment.commNo}
              comment={comment}
              onDelete={deleteComment}
              onEdit={editComment}
            />
          ))}
        </ul>
        {memberNickname && (
          <>
            {!isCommenting ? (
              <button
                className="btn-primary"
                onClick={() => setIsCommenting(true)}
              >
                댓글 작성
              </button>
            ) : (
              <div className="comment-form-actions">
                <input
                  className="write-comment-zone"
                  type="text"
                  value={newComment}
                  onChange={(e) => setNewComment(e.target.value)}
                />
                <button
                  className="btn-primary"
                  onClick={() => {
                    const form = new FormData();
                    form.append("reviewNo", reviewNo);
                    form.append("commContent", newComment);
                    form.append("memberNickname", memberNickname);
                    axios
                      .post(`${process.env.REACT_APP_BACK_SERVER}/comm`, form)
                      .then((res) => {
                        setComments([...comments, res.data]);
                      })
                      .catch((err) => console.log(err));
                    setNewComment("");
                    setIsCommenting(false);
                  }}
                >
                  등록
                </button>
                <button
                  className="btn-secondary"
                  onClick={() => setIsCommenting(false)}
                >
                  취소
                </button>
              </div>
            )}
          </>
        )}
      </div>

      {isReporting && (
        <div className="modal">
          <h3>신고 사유 선택</h3>
          <select
            onChange={(e) => setReportReason(e.target.value)}
            value={reportReason}
          >
            <option value="">-- 신고 사유 선택 --</option>
            {REPORT_REASONS.map((reason, index) => (
              <option key={index} value={reason}>
                {reason}
              </option>
            ))}
          </select>
          <button onClick={reportSubmit}>신고 접수</button>
          <button onClick={() => setIsReporting(false)}>취소</button>
        </div>
      )}
    </section>
  );
};

const CommentItem = ({ comment, onDelete, onEdit }) => {
  const [memberNickname, setMemberNickname] =
    useRecoilState(loginNicknameState);
  const [member, setMember] = useState(null);

  useEffect(() => {
    axios
      .get(
        `${process.env.REACT_APP_BACK_SERVER}/member/memberInfo?memberNickname=${memberNickname}`
      )
      .then((res) => setMember(res.data))
      .catch((err) => console.log(err));
  }, []);

  return (
    <li className="comment-item">
      <img
        src="/image/profile_default_image.png"
        alt=""
        className="comment-profile-image"
      />
      <div className="comment-content-wrapper">
        <div className="comment-header">
          <span className="comment-nickname">{comment.memberNickname}</span>
          {comment.memberNickname === memberNickname && (
            <div className="comment-action-buttons">
              <DeleteIcon
                className="comment-action-icon"
                onClick={() => onDelete(comment.commNo)}
              />
              <EditIcon
                className="comment-action-icon"
                onClick={() => onEdit(comment.commNo)}
              />
            </div>
          )}
        </div>
        <p className="comment-text">{comment.commContent}</p>
      </div>
    </li>
  );
};

export default ReviewView;
