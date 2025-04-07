import axios from "axios";
import { useEffect } from "react";
import { useNavigate } from "react-router-dom";

const LoginKakao = () => {
  const navigate = useNavigate();
  const code = new URL(window.location.href).searchParams.get("code");
  console.log(code);
  const headers = {
    "Content-Type": "application/x-www-form-urlencoded",
  };

  useEffect(() => {
    axios
      .post(`${process.env.REACT_APP_BACK_SERVER}/kakao/login`, { code })
      .then((response) => {
        console.log(response.data.result.user_id);
        console.log(response.data.result.jwt);
      })
      .catch((err) => {
        console.log(err);
      });
  }, [code]);

  return (
    <div>
      <h1>로그인 중입니다.</h1>
    </div>
  );
};

export default LoginKakao;
