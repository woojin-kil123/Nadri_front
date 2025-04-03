import { useRecoilValue } from "recoil";
import { isLoginState, memberLevelState } from "./RecoilData";
import { Navigate, useNavigate } from "react-router-dom";
import Swal from "sweetalert2";
import { useEffect, useState } from "react";

//비로그인 처리 시 사용하세요
const AdminRouting = ({ element }) => {
  const isLogin = useRecoilValue(isLoginState);
  const [interception, setInterCeption] = useState(false);
  const memberLevel = useRecoilValue(memberLevelState);
  const navigate = useNavigate();
  useEffect(() => {
    if (!isLogin) {
      Swal.fire({
        title: "로그인이 필요합니다",
        icon: "warning",
        text: "해당 서비스는 로그인 후 이용하실 수 있습니다.",
        confirmButtonText: "확인",
      }).then(() => {
        navigate("/login", { replace: true });
      });
      return; // element 렌더링 방지
    }
    if (memberLevel === 1) {
      Swal.fire({
        title: "일반 사용자는 사용할 수 없습니다.",
        icon: "warning",
        text: "관리자에게 문의하세요.",
        confirmButtonText: "확인",
      }).then(() => {
        navigate("/", { replace: true });
      });
      return;
    }

    setInterCeption(true); // 모든 조건 통과 시만 렌더링
  }, [isLogin]);

  if (!isLogin && !interception) return null;

  //replace: 로그인 페이지로 이동한 뒤 뒤로가기를 눌러도 진입을 시도했던 페이지로 다시 돌아가지 않게 해 줌
  return element;
};

export default AdminRouting;
