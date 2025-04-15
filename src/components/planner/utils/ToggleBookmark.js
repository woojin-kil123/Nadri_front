import { useRecoilValue } from "recoil";
import { isLoginState, loginNicknameState } from "../../utils/RecoilData";
import Swal from "sweetalert2";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { useEffect, useState } from "react";
import { Checkbox } from "@mui/material";
import { Bookmark, BookmarkBorder } from "@mui/icons-material";

const ToggleBookmark = ({ bookmarked, objectNo, controllerUrl }) => {
  const isLogin = useRecoilValue(isLoginState);
  const memberNickname = useRecoilValue(loginNicknameState);
  const navigate = useNavigate();
  const [bookmarkState, setBookmarkState] = useState(bookmarked === 1);

  useEffect(() => {
    setBookmarkState(bookmarked);
  }, [bookmarked]);

  const toggle = (objectNo) => {
    axios
      // controllerUrl의 값은 컨트롤러의 요청 주소에 해당합니다. (ex. "/plan")
      // 최종적으로, 컨트롤러에서는 pathVariable로 인자를 전달받게 됩니다.
      .patch(
        `${process.env.REACT_APP_BACK_SERVER}${controllerUrl}/${objectNo}/${memberNickname}`
      )
      .then((res) => {
        setBookmarkState(res.data === 1);
      })
      .catch((err) => {
        console.log(err);
      });
  };

  const handleClick = (e) => {
    e.stopPropagation();

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
      <Checkbox
        sx={{ m: 1 }}
        size="large"
        checked={bookmarkState}
        onChange={handleClick}
        icon={<BookmarkBorder />}
        checkedIcon={<Bookmark />}
      />
    </div>
  );
};

export default ToggleBookmark;
