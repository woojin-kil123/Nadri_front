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
import { Margin } from "@mui/icons-material";
import StarRating from "../utils/StarRating";
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
        setMember(res.data);
      })
      .catch((err) => {});
  }, [memberNickname]);
  //댓글 수정
  const editComment = (commNo, editedContent) => {
    axios
      .patch(`${process.env.REACT_APP_BACK_SERVER}/review/comm/${commNo}`, {
        commContent: editedContent,
      })
      .then((res) => {
        if (res.data === 1) {
          const updatedComments = comments.map((comment) =>
            comment.commNo === commNo
              ? { ...comment, commContent: editedContent }
              : comment
          );
          setComments(updatedComments);
        }
      })
      .catch((err) => {});
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
          .delete(`${process.env.REACT_APP_BACK_SERVER}/review/comm/${commNo}`)
          .then((res) => {
            if (res.data === 1) {
              const newComments = comments.filter(
                (comment) => comment.commNo !== commNo
              );
              setComments(newComments);
            }
          })
          .catch((err) => {});
      }
    });
  };
  const [liked, setLiked] = useState(false);
  const [likeCount, setLikeCount] = useState(0);
  const [review, setReview] = useState({});
  //좋아요 불러오기
  useEffect(() => {
    axios
      .get(`${process.env.REACT_APP_BACK_SERVER}/review/likes/${reviewNo}`)
      .then((res) => {
        setLikeCount(res.data.likes);
        if (
          res.data.likeMember.some(
            (member) => member.memberNickname === memberNickname
          )
        ) {
          setLiked(true);
        }
      })
      .catch((err) => {});
  }, []);
  //좋아요 기능 구현
  const toggleLike = () => {
    if (!memberNickname) {
      alert("로그인 후 좋아요를 누를 수 있습니다.");
      return;
    }
    if (liked) {
      axios
        .delete(
          `${process.env.REACT_APP_BACK_SERVER}/review/likes/${reviewNo}`,
          {
            data: { memberNickname },
          }
        )
        .catch((err) => {});
    } else {
      const form = new FormData();
      form.append("reviewNo", reviewNo);
      form.append("memberNickname", memberNickname);
      axios
        .post(`${process.env.REACT_APP_BACK_SERVER}/review/likes`, form)
        .catch((err) => {});
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
          .catch((err) => {});
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
    if (reportNicknames.includes(memberNickname)) {
      alert("이미 신고한 유저입니다.");
      return; // 이미 신고한 유저라면 신고 창으로 넘어가지 않음
    }
    setReportTarget(target);
    setIsReporting(true); // 신고 창 열기
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
      .post(`${process.env.REACT_APP_BACK_SERVER}/review/report/`, reportData)
      .then(() => {
        alert(`"${reportReason}" 사유로 신고되었습니다.`);
        navigate("/review");
      })
      .catch((err) => {});

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
      .catch((err) => {});
  }, []);

  //여행지 정보
  useEffect(() => {
    if (placeId !== 0) {
      axios
        .get(
          `${process.env.REACT_APP_BACK_SERVER}/place/detail?placeId=${placeId}`
        )
        .then((res) => {
          setPlaceInfo(res.data);
        })
        .catch((err) => {});
    }
  }, [placeId]);
  //신고자 목록
  const [reportNicknames, setReportNicknames] = useState([]);
  useEffect(() => {
    axios
      .get(`${process.env.REACT_APP_BACK_SERVER}/review/report/${reviewNo}`)
      .then((res) => {
        const nicknames = res.data.map((report) => report.reportNickname);

        // 중복된 닉네임을 제거
        const uniqueNicknames = [...new Set(nicknames)];

        // 상태에 저장
        setReportNicknames(uniqueNicknames);
      })
      .catch((err) => {});
  }, []);
  useEffect(() => {
    axios
      .get(`${process.env.REACT_APP_BACK_SERVER}/review/comm/${reviewNo}`)
      .then((res) => setComments(res.data))
      .catch((err) => {});
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
        .catch((err) => {});
    }
  }, [review]);

  return (
    <section className="section review-view-section">
      <div className="page-title">리뷰 상세보기</div>

      <div className="review-card">
        {/* 장소 정보 */}
        <div className="review-left">
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

        {/* 리뷰 정보 */}
        <div className="review-right">
          <div className="review-header">
            <div
              className="review-header-top"
              style={{ borderBottom: "1px solid #ccc", marginBottom: "20px" }}
            >
              <h3 className="review-title" style={{ textAlign: "center" }}>
                {review.reviewTitle}
              </h3>
            </div>

            <div
              className="review-meta"
              style={{
                borderBottom: "1px solid #ccc",
                marginBottom: "15px",
              }}
            >
              <div
                className="review-metat-content"
                style={{
                  marginLeft: "20px",
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                  width: "100%", // 가로 폭 꽉 채움
                  maxWidth: "600px",
                }}
              >
                <div style={{ flex: 1, textAlign: "left" }}>
                  <StarRating rating={review.starRate} />
                </div>
                <div style={{ flex: 1, textAlign: "center", fontSize: "15px" }}>
                  <span className="author">{review.memberNickname}</span>
                </div>
                <div style={{ flex: 1, textAlign: "right", fontSize: "15px" }}>
                  <span className="date">작성일:{review.reviewDate}</span>
                </div>
              </div>
            </div>

            {/* 본문 내용 */}
            <div
              className="review-body"
              dangerouslySetInnerHTML={{
                __html: review.reviewContent,
              }}
            />

            {/* 첨부 이미지 */}
            {reviewImages.length > 0 && (
              <div className="review-images">
                {reviewImages.map((img, index) => (
                  <div className="review-image-wrapper" key={index}>
                    <img
                      src={`${process.env.REACT_APP_BACK_SERVER}/assets/place/image/${img.filepath}`}
                      alt=""
                      className="review-image2"
                    />
                  </div>
                ))}
              </div>
            )}
            <div className="review-actions">
              <div className="like-wrapper">
                <button
                  onClick={toggleLike}
                  className="like-button"
                  style={{
                    background: "none",
                    border: "none",
                    cursor: "pointer",
                    display: "flex",
                    alignItems: "center",
                  }}
                >
                  {liked ? (
                    <FavoriteIcon
                      color="error"
                      sx={{
                        width: "20px",
                        height: "20px",
                        verticalAlign: "middle",
                      }}
                    />
                  ) : (
                    <FavoriteBorderIcon
                      sx={{
                        width: "20px",
                        height: "20px",
                        verticalAlign: "middle",
                      }}
                    />
                  )}
                </button>
                <span
                  style={{
                    alignItems: "center",
                    fontSize: "15px",
                    verticalAlign: "middle",
                    marginLeft: "4px",
                  }}
                >
                  {likeCount}
                </span>
              </div>

              <div
                className="multi-btn-zone"
                style={{ display: "flex", gap: "8px", alignItems: "center" }}
              >
                {memberNickname === review.memberNickname ? (
                  <>
                    <EditNoteIcon
                      onClick={editReview}
                      sx={{
                        width: "20px",
                        height: "20px",
                        cursor: "pointer",
                        verticalAlign: "middle",
                      }}
                    />
                    <DeleteIcon
                      onClick={deleteReview}
                      sx={{
                        width: "20px",
                        height: "20px",
                        cursor: "pointer",
                        verticalAlign: "middle",
                      }}
                    />
                  </>
                ) : (
                  <ReportIcon
                    onClick={reportClick}
                    sx={{
                      width: "20px",
                      height: "20px",
                      cursor: "pointer",
                      verticalAlign: "middle",
                    }}
                  />
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
      {/* 댓글 영역 */}
      <div className="comment-wrap">
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
                  style={{ width: "70%" }}
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
                      .post(
                        `${process.env.REACT_APP_BACK_SERVER}/review/comm`,
                        form
                      )
                      .then((res) => {
                        setComments([...comments, res.data]);
                      })
                      .catch((err) => {});
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
          <button
            onClick={() => {
              if (reportNicknames.includes(memberNickname)) {
                alert("이미 신고한 글입니다.");
                return;
              }
              reportSubmit();
            }}
            className="btn-primary report-move"
          >
            신고 접수
          </button>
          <button
            onClick={() => setIsReporting(false)}
            className="btn-secondary"
          >
            취소
          </button>
        </div>
      )}
    </section>
  );
};

const CommentItem = ({ comment, onDelete, onEdit }) => {
  const [isEditing, setIsEditing] = useState(false); // Track edit state
  const [editedContent, setEditedContent] = useState(comment.commContent); // Track edited content
  const [memberNickname, setMemberNickname] =
    useRecoilState(loginNicknameState);

  // Handle comment update
  const handleSave = () => {
    if (editedContent !== comment.commContent) {
      // If content is modified, call the onEdit function to save changes
      onEdit(comment.commNo, editedContent);
    }
    setIsEditing(false); // Close editing mode
  };

  // Handle cancel edit
  const handleCancel = () => {
    setEditedContent(comment.commContent); // Reset to original content
    setIsEditing(false); // Close editing mode
  };

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
              {!isEditing ? (
                <EditIcon
                  className="comment-action-icon"
                  onClick={() => setIsEditing(true)}
                />
              ) : null}
            </div>
          )}
        </div>
        {/* 수정 모드에서는 텍스트 필드, 아닌 경우 기존 댓글 표시 */}
        {isEditing ? (
          <div className="edit-comment-zone">
            <input
              type="text"
              className="edit-comment-input"
              value={editedContent}
              style={{ width: "75%" }}
              onChange={(e) => setEditedContent(e.target.value)}
            />
            {/* 버튼을 입력 필드 옆에 두기 */}
            <div className="edit-comment-buttons">
              <button
                className="btn-primary"
                onClick={handleSave}
                style={{ marginRight: "5px" }}
              >
                저장
              </button>
              <button className="btn-secondary" onClick={handleCancel}>
                취소
              </button>
            </div>
          </div>
        ) : (
          <p className="comment-text">{comment.commContent}</p>
        )}
      </div>
    </li>
  );
};

export default ReviewView;
