const ReviewView = () => {
  const [comments, setComments] = useState(reviewData.comments);
  const [newComment, setNewComment] = useState("");
  const addComment = () => {
    if (newComment.trim() === "") return;
    setComments([...comments, { id: Date.now(), text: newComment }]);
    setNewComment("");
  };
  const deleteComment = (id) => {
    setComments(comments.filter((comment) => comment.id !== id));
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

  // 신고 버튼 클릭 시
  const handleReportClick = (target) => {
    setReportTarget(target);
    setIsReporting(true);
  };
  const handleReportSubmit = () => {
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
      <h2>title</h2>
      <p>content</p>
      <button onClick={() => onEdit(reviewData)}>리뷰 수정</button>
      <button onClick={handleReportReview}>리뷰 신고</button>
      <h3>댓글</h3>
      <ul>
        {comments.map((comment) => (
          <li key={comment.id}>
            {comment.text}
            <button onClick={() => deleteComment(comment.id)}>삭제</button>
          </li>
        ))}
      </ul>
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
          <button onClick={handleReportSubmit}>신고 접수</button>
          <button onClick={() => setIsReporting(false)}>취소</button>
        </div>
      )}
    </section>
  );
};
export default ReviewView;
