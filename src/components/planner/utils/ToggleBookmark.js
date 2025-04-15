import { useRecoilValue } from "recoil";
import { isLoginState, loginNicknameState } from "../../utils/RecoilData";
import Swal from "sweetalert2";
import { useNavigate, useParams } from "react-router-dom";
import axios from "axios";
import { useEffect, useState } from "react";
import { Checkbox } from "@mui/material";
import { Bookmark, BookmarkBorder } from "@mui/icons-material";

const ToggleBookmark = ({ bookmarked }) => {
  const isLogin = useRecoilValue(isLoginState);
  const memberNickname = useRecoilValue(loginNicknameState);
  const navigate = useNavigate();
  const { planNo } = useParams();

  const [bookmarkState, setBookmarkState] = useState(bookmarked === 1);

  useEffect(() => {
    setBookmarkState(bookmarked);
  }, [bookmarked]);

  const toggleLike = (planNo) => {
    axios
      .patch(
        `${process.env.REACT_APP_BACK_SERVER}/plan/${planNo}/${memberNickname}`
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
      toggleLike(planNo);
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
