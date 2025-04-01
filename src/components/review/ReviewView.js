import { useNavigate } from "react-router-dom";
import { useState } from "react";
import "./review.css";
import FavoriteBorderIcon from "@mui/icons-material/FavoriteBorder";
import FavoriteIcon from "@mui/icons-material/Favorite";
import DeleteIcon from "@mui/icons-material/Delete";
import ReportIcon from "@mui/icons-material/Report";
import EditNoteIcon from "@mui/icons-material/EditNote";

const ReviewView = () => {
  const [comments, setComments] = useState([]);
  const [newComment, setNewComment] = useState("");
  const navigate = useNavigate();
  const [isCommenting, setIsCommenting] = useState(false);
  const deleteComment = (id) => {
    setComments(comments.filter((comment) => comment.id !== id));
  };

  const [liked, setLiked] = useState(false);
  const [likeCount, setLikeCount] = useState(0);

  const toggleLike = () => {
    setLiked(!liked);
    setLikeCount((prev) => (liked ? prev - 1 : prev + 1));
  };
  const REPORT_REASONS = [
    "부적절한 콘텐츠 – 욕설, 비방, 혐오 발언 등이 포함된 리뷰",
    "허위 정보 – 실제 방문하지 않았거나, 거짓 정보를 포함한 리뷰",
    "광고/스팸 – 특정 업체 홍보나 광고 목적으로 작성된 리뷰",
    "부적절한 이미지 – 폭력적이거나 선정적인 이미지가 포함된 경우",
    "리뷰와 무관한 내용 – 여행지와 관련 없는 내용이 포함된 경우",
  ];
  const ReviewDetail = ({ reviewData, onEdit }) => {
    const [comments, setComments] = useState(reviewData.comments);
    const [newComment, setNewComment] = useState("");
  };
  // 신고 모달 상태
  const [isReporting, setIsReporting] = useState(false);
  const [reportReason, setReportReason] = useState("");
  const [reportTarget, setReportTarget] = useState(null); // 리뷰 또는 댓글 ID
  const editReview = () => {
    navigate("/editreview");
  };
  // 신고 버튼 클릭 시
  const reportClick = (target) => {
    setReportTarget(target);
    setIsReporting(true);
  };
  const reportSubmit = () => {
    if (!reportReason) {
      alert("신고 사유를 선택해주세요.");
      return;
    }
    alert(`"${reportReason}" 사유로 신고되었습니다.`);
    setIsReporting(false);
    setReportReason("");
    setReportTarget(null);
  };
  return (
    <section className="section">
      <div className="page-title">리뷰 상세보기</div>
      <div className="review-content">
        <h2>title</h2>
        <p>content</p>
        <button
          onClick={toggleLike}
          style={{ background: "none", border: "none" }}
        >
          {liked ? <FavoriteIcon color="error" /> : <FavoriteBorderIcon />}
        </button>
        <span>{likeCount}</span>
        <EditNoteIcon onClick={editReview}>리뷰 수정</EditNoteIcon>
        <ReportIcon onClick={reportClick}>리뷰 신고</ReportIcon>
        <h3>댓글</h3>
        <ul>
          {comments.map((comment) => (
            <li key={comment.id}>
              {comment.text}
              <DeleteIcon onClick={() => deleteComment(comment.id)}>
                삭제
              </DeleteIcon>
            </li>
          ))}
        </ul>
        {!isCommenting ? (
          <button onClick={() => setIsCommenting(true)}>댓글 작성</button>
        ) : (
          <div>
            <input
              type="text"
              value={newComment}
              onChange={(e) => setNewComment(e.target.value)}
            />
            <button
              onClick={() => {
                setComments([
                  ...comments,
                  { id: Date.now(), text: newComment },
                ]);
                setNewComment(""); // 입력 필드 초기화
                setIsCommenting(false); // 입력 필드 숨김
              }}
            >
              등록
            </button>
            <button onClick={() => setIsCommenting(false)}>취소</button>
          </div>
        )}
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
      </div>
    </section>
  );
};
export default ReviewView;
