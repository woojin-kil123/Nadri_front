import { useRecoilValue } from "recoil";
import { isLoginState, loginNicknameState } from "../../utils/RecoilData";
import Swal from "sweetalert2";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { Checkbox, Tooltip } from "@mui/material";
import { Bookmark, BookmarkBorder } from "@mui/icons-material";

const ToggleBookmark = ({
  bookmarked,
  setBookmarked,
  objectNo,
  controllerUrl,
}) => {
  const isLogin = useRecoilValue(isLoginState);
  const memberNickname = useRecoilValue(loginNicknameState);
  const navigate = useNavigate();
  // const [bookmarkState, setBookmarkState] = useState(bookmarked === 1);

  const toggle = (objectNo) => {
    axios
      // controllerUrl의 값은 컨트롤러의 요청 주소에 해당합니다. (ex. "/plan")
      // 최종적으로, 컨트롤러에서는 pathVariable로 인자를 전달받게 됩니다.
      .patch(
        `${process.env.REACT_APP_BACK_SERVER}${controllerUrl}/${objectNo}/${memberNickname}`
      )
      .then((res) => {
        setBookmarked(res.data === 1 ? 1 : 0);
      })
      .catch((err) => {
        console.log(err);
      });
  };

  const handleClick = (e) => {
    if (!isLogin) {
      Swal.fire({
        title: "로그인이 필요합니다",
        icon: "warning",
        text: "로그인 후 좋아하는 장소로 나드리가요!",
        confirmButtonText: "확인",
      }).then(() => navigate("/login", { replace: true }));
    } else {
      toggle(objectNo);
    }
  };

  return (
    <div className="close-btn">
      <Tooltip title="북마크">
        <Checkbox
          sx={{ m: 1 }}
          size="large"
          checked={bookmarked === 1}
          onClick={(e) => e.stopPropagation()} // 이거 꼭 필요!
          onChange={handleClick}
          icon={<BookmarkBorder sx={{ fill: "var(--gray4)" }} />}
          checkedIcon={<Bookmark sx={{ fill: "var(--main4)" }} />}
        />
      </Tooltip>
    </div>
  );
};

export default ToggleBookmark;
