import axios from "axios";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Swal from "sweetalert2";
import { loginNicknameState, memberLevelState } from "../utils/RecoilData";
import { useRecoilState } from "recoil";

const LoginKakao = () => {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  // member: 이메일과 비밀번호를 저장하는 상태
  const [member, setMember] = useState({ memberEmail: "" });
  const [memberNickname, setMemberNickname] =
    useRecoilState(loginNicknameState);
  const [memberLevel, setMemberLevel] = useRecoilState(memberLevelState);
  const code = new URL(window.location.href).searchParams.get("code");
  const headers = {
    "Content-Type": "application/x-www-form-urlencoded",
  };

  useEffect(() => {
    axios
      .post(`${process.env.REACT_APP_BACK_SERVER}/kakao/login`, { code })
      .then((res) => {
        const userEmail = res.data; // 받은 이메일 값을 바로 사용
        setEmail(userEmail); // 이메일 상태 업데이트

        // 이메일 중복 체크 API 요청
        axios
          .get(
            `${process.env.REACT_APP_BACK_SERVER}/member/existsEmail?memberEmail=${userEmail}`
          )
          .then((res) => {
            if (res.data === 0) {
              navigate("/socialJoin", { state: { email: userEmail } });
            } else {
              axios
                .get(
                  `${process.env.REACT_APP_BACK_SERVER}/member/socialLogin?userEmail=${userEmail}`,
                  userEmail
                )
                .then((res) => {
                  setMemberNickname(res.data.memberNickname);
                  setMemberLevel(res.data.memberLevel);
                  //로그인 이후 axios를 통한 요청을 수행하는 경우 토큰값을 자동으로 axios에 추가하는 설정
                  axios.defaults.headers.common["Authorization"] =
                    res.data.accessToken;
                  window.localStorage.setItem(
                    "refreshToken",
                    res.data.refreshToken
                  );
                  // 로그인 성공 시, 로그인 상태 저장 및 페이지 이동
                  navigate("/"); // 로그인 후 홈으로 이동
                })
                .catch((err) => {
                  // 로그인 실패 시 경고 메시지 표시
                  Swal.fire({
                    text: "로그인 에러입니다.",
                    icon: "warning",
                    confirmButtonColor: "var(--main2)",
                  });
                });
            }
          })
          .catch((err) => {});
      })
      .catch((err) => {});
  }, []);
};

export default LoginKakao;
