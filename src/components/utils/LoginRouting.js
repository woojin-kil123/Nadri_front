import { useRecoilValue } from "recoil";
import { isLoginState } from "./RecoilData";
import { Navigate } from "react-router-dom";
import Swal from "sweetalert2";
import { useEffect, useState } from "react";

//비로그인 처리 시 사용하세요
const LoginRouting = ({ element }) => {
  const isLogin = useRecoilValue(isLoginState);
  const [interception, setInterCeption] = useState(false);

  useEffect(() => {
    if (!isLogin) {
      Swal.fire({
        title: "로그인이 필요합니다",
        icon: "warning",
        text: "해당 서비스는 로그인 후 이용하실 수 있습니다.",
        confirmButtonText: "확인",
      }).then(() => {
        setInterCeption(true);
      });
    }
  }, [isLogin]);

  if (!isLogin && !interception) return null;

  //replace: 로그인 페이지로 이동한 뒤 뒤로가기를 눌러도 진입을 시도했던 페이지로 다시 돌아가지 않게 해 줌
  if (interception) return <Navigate to="/login" replace />;

  return element;
};

export default LoginRouting;
