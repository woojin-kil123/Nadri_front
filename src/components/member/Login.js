import "./member.css";
import { Link, Route, Routes, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import axios from "axios";
import Swal from "sweetalert2";
import { useRecoilState } from "recoil";
import {
  loginNicknameState,
  memberLevelState,
  memberNoState,
} from "../utils/RecoilData";
import TextField from "@mui/material/TextField";
import VisibilityIcon from "@mui/icons-material/Visibility";
import VisibilityOffIcon from "@mui/icons-material/VisibilityOff";

const Login = () => {
  const navigate = useNavigate();
  const [memberNickname, setMemberNickname] =
    useRecoilState(loginNicknameState);
  const [memberLevel, setMemberLevel] = useRecoilState(memberLevelState);
  const [memberNo, setMemberNo] = useRecoilState(memberNoState);
  const [isButtonEnabled, setIsButtonEnabled] = useState(false); // 로그인 버튼 활성화 여부

  // member: 이메일과 비밀번호를 저장하는 상태
  const [member, setMember] = useState({ memberEmail: "", memberPw: "" });

  // emailError와 passwordError: 각각 이메일과 비밀번호 입력란의 오류 메시지를 관리하는 상태
  const [emailError, setEmailError] = useState("");
  const [passwordError, setPasswordError] = useState("");

  // 비밀번호 보이기/숨기기 상태
  const [isPasswordVisible, setIsPasswordVisible] = useState(false);

  // 비밀번호 보이기/숨기기 토글 핸들러
  const togglePasswordVisibility = () => {
    setIsPasswordVisible(!isPasswordVisible);
  };

  // 이메일에 @가 포함되어 있는지 확인하는 함수
  const validateEmail = (email) => {
    return email.includes("@"); // 이메일에 @가 포함되어 있으면 true, 아니면 false
  };

  // 입력값을 상태에 저장하는 함수
  const changeMember = (e) => {
    const name = e.target.name;
    const inputData = e.target.value;
    setMember({ ...member, [name]: inputData });

    // 이메일과 비밀번호가 모두 입력되고, 이메일 형식이 올바르면 버튼을 활성화합니다.
    if (
      member.memberEmail &&
      member.memberPw &&
      validateEmail(member.memberEmail)
    ) {
      setIsButtonEnabled(true); // 버튼 활성화
    } else {
      setIsButtonEnabled(false); // 버튼 비활성화
    }
  };

  // 이메일 입력란에서 포커스를 떴을 때 처리하는 함수
  const handleEmailBlur = () => {
    const email = member.memberEmail.trim();
    if (email === "") {
      setEmailError("이메일 주소를 입력해 주세요.."); // 이메일이 비어 있으면 오류 메시지 표시
    } else if (!email.includes("@")) {
      setEmailError("올바른 형식의 이메일 주소를 입력해 주세요."); // 이메일에 @가 없으면 오류 메시지 표시
    } else {
      setEmailError(""); // 이메일이 올바르면 오류 메시지 제거
    }
  };

  // 비밀번호 입력란에서 포커스를 떴을 때 처리하는 함수
  const handlePasswordBlur = () => {
    const password = member.memberPw.trim();
    if (password === "") {
      setPasswordError("비밀번호를 입력해주세요."); // 비밀번호가 비어 있으면 오류 메시지 표시
    } else {
      setPasswordError(""); // 비밀번호가 올바르면 오류 메시지 제거
    }
  };

  // 로그인 함수
  const login = () => {
    // 이메일이나 비밀번호가 비어 있으면 경고 메시지 표시
    if (member.memberEmail === "" || member.memberPw === "") {
      Swal.fire({
        text: "이메일 또는 비밀번호를 입력하세요",
        icon: "info",
        confirmButtonColor: "var(--main2)",
      });
      return;
    }

    // 로그인 API 요청
    axios
      .post(`${process.env.REACT_APP_BACK_SERVER}/member/login`, member)
      .then((res) => {
        if (res.data === "") {
          Swal.fire({
            text: "강제탈퇴 된 회원입니다.",
            icon: "warning",
            confirmButtonColor: "var(--main2)",
          }).then((result) => {
            if (result.isConfirmed) {
              axios
                .patch(
                  `${process.env.REACT_APP_BACK_SERVER}/member/deleteDelMember`,
                  member
                )
                .then((res) => {
                  navigate("/");
                })
                .catch((err) => {});
            }
          });
        } else {
          setMemberNickname(res.data.memberNickname);
          setMemberLevel(res.data.memberLevel);
          setMemberNo(res.data.memberNo);
          //로그인 이후 axios를 통한 요청을 수행하는 경우 토큰값을 자동으로 axios에 추가하는 설정
          axios.defaults.headers.common["Authorization"] = res.data.accessToken;
          window.localStorage.setItem("refreshToken", res.data.refreshToken);
          // 로그인 성공 시, 로그인 상태 저장 및 페이지 이동
        }
        navigate("/"); // 로그인 후 홈으로 이동
      })
      .catch((err) => {
        // 로그인 실패 시 경고 메시지 표시
        Swal.fire({
          text: "아이디 또는 비밀번호를 확인하세요.",
          icon: "warning",
          confirmButtonColor: "var(--main2)",
        });
      });
  };

  return (
    <section className="section">
      <div className="login-logo">NADRI</div>
      <div className="login-wrap">
        <h1 className="login-title">이메일 로그인</h1>
        <div className="email-login-wrap">
          <form
            onSubmit={(e) => {
              e.preventDefault();
              login(); // 로그인 함수 호출
            }}
          >
            {/* 이메일 입력란 */}
            <div className="input-wrap">
              <div className="input-title">
                <label htmlFor="memberEmail">이메일</label>
              </div>
              <div className="input-item">
                <input
                  type="text"
                  name="memberEmail"
                  id="memberEmail"
                  value={member.memberEmail}
                  onChange={changeMember} // 입력값 변경 시 상태 업데이트
                  //onBlur={handleEmailBlur} // 포커스를 떴을 때 이메일 검사
                />
              </div>
              {/* 이메일 오류 메시지 표시 */}
              {emailError && <p className="input-error">{emailError}</p>}
            </div>

            {/* 비밀번호 입력란 */}
            <div className="input-wrap">
              <div className="input-title">
                <label htmlFor="memberPw">비밀번호</label>
              </div>
              <div className="input-item" style={{ position: "relative" }}>
                <input
                  type={isPasswordVisible ? "text" : "password"} // 비밀번호가 보일 때는 text로, 숨길 때는 password로 설정
                  name="memberPw"
                  id="memberPw"
                  value={member.memberPw}
                  onChange={changeMember} // 입력값 변경 시 상태 업데이트
                />
                <span
                  className="password-toggle-icon"
                  onClick={togglePasswordVisibility}
                  style={{
                    position: "absolute",
                    right: "10px", // 오른쪽에 배치
                    top: "50%", // 수직 중앙 정렬
                    transform: "translateY(-50%)",
                    cursor: "pointer",
                    zIndex: "1", // 아이콘이 input 위에 오도록 설정
                  }}
                >
                  {isPasswordVisible ? (
                    <VisibilityIcon />
                  ) : (
                    <VisibilityOffIcon />
                  )}
                </span>
              </div>

              {/* 비밀번호 오류 메시지 표시 */}
              {passwordError && <p className="input-error">{passwordError}</p>}
            </div>

            {/* 로그인 버튼 */}
            <div className="login-button-box">
              <button
                type="submit"
                className="btn-primary lg"
                disabled={!isButtonEnabled} // 버튼 비활성화
                style={{
                  pointerEvents: isButtonEnabled ? "auto" : "none", // 버튼 비활성화 시 클릭 불가
                  backgroundColor: isButtonEnabled ? "#30c272" : "white", // 비활성화 시 배경색 흰색으로
                  color: isButtonEnabled ? "white" : "#d3d3d3", // 비활성화 시 글자색 여린 회색으로
                }}
                onMouseEnter={(e) => {
                  if (isButtonEnabled) {
                    e.target.style.backgroundColor = "#166139"; // hover 시 배경색 변경
                  }
                }}
                onMouseLeave={(e) => {
                  if (isButtonEnabled) {
                    e.target.style.backgroundColor = "#30c272"; // hover 끝난 후 원래 배경색으로 복구
                  }
                }}
              >
                로그인
              </button>
            </div>
            {/* 회원가입, 비밀번호 재설정 링크 */}
            <div className="member-link-box">
              <Link to="/join">회원가입</Link>
              <p>|</p>
              <Link to="/updatePw">비밀번호 재설정</Link>
            </div>
          </form>
        </div>

        <div className="social-login">
          {/* 카카오톡 로그인 버튼 */}
          <div className="kakao-login-join">
            <Link>
              <img
                src="/image/kakao_login2.png"
                alt="Kakao Login"
                onClick={handleKakaoLogin}
              />
            </Link>
            <div></div>
          </div>
          {/* 네이버 로그인 버튼 */}
          {/*
          <div className="naver-login-join">
            <Link>
              <img src="/image/naver_login.png" alt="Naver Login" />
            </Link>
          </div>
          */}
        </div>
      </div>
    </section>
  );
};

const REST_API_KEY = process.env.REACT_APP_REST_API_KEY;
const REDIRECT_URL = process.env.REACT_APP_REDIRECT_URL;
const kakaoURL = `https://kauth.kakao.com/oauth/authorize?client_id=${"0f9506fb15c78477c1e301647bd62df2"}&redirect_uri=${"http://192.168.10.20:3000/login/kakao"}&response_type=code`;

const handleKakaoLogin = () => {
  window.location.href = kakaoURL; //kakaoURL로 이동
};

export default Login;
