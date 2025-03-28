import "./member.css";
import { Link, Route, Routes, useNavigate } from "react-router-dom";
import { useState } from "react";
import axios from "axios";
import Swal from "sweetalert2";
import { useRecoilState } from "recoil";
import { loginNicknameState, memberTypeState } from "../utils/RecoilData";

const Login = () => {
  const navigate = useNavigate();
  const [memberNickname, setMemberNickname] =
    useRecoilState(loginNicknameState);
  const [memberType, setMemberType] = useRecoilState(memberTypeState);
  const [member, setMember] = useState({ memberEmail: "", memberPw: "" });
  const changeMember = (e) => {
    const name = e.target.name;
    const inputData = e.target.value;
    setMember({ ...member, [name]: inputData });
  };
  const Login = () => {
    if (member.memberEmail === "" || member.memberPw === "") {
      Swal.fire({
        text: "아이디 또는 비밀번호를 입력하세요",
        icon: "info",
      });
      return;
    }

    axios
      .post(`${process.env.REACT_APP_BACK_SERVER}/member/login`, member)
      .then((res) => {
        console.log(res);
        setMemberNickname(res.data.memberNickname);
        setMemberType(res.data.memberType);
        axios.defaults.headers.common["Authorization"] = res.data.accessToken;

        window.localStorage.setItem("refreshToken", res.data.refreshToken);
        navigate("/");
      })
      .catch((err) => {
        console.log(err);
        Swal.fire({
          text: "아이디 또는 비밀번호를 확인하세요.",
          icon: "warning",
        });
      });
  };

  return (
    <section className="section">
      <div className="logo">
        <Link>NADRI</Link>
      </div>
      <div className="login-wrap">
        <h1 className="login-join-title">이메일 로그인</h1>
        <dlv className="email-login-wrap">
          <form
            onSubmit={(e) => {
              e.preventDefault();
              Login();
            }}
          >
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
                  onChange={changeMember}
                ></input>
              </div>
            </div>

            <div className="input-wrap">
              <div className="input-title">
                <label htmlFor="memberPw">비밀번호</label>
              </div>
              <div className="input-item">
                <input
                  type="password"
                  name="memberPw"
                  id="memberPw"
                  value={member.memberPw}
                  onChange={changeMember}
                ></input>
              </div>
            </div>
            <div className="login-button-box">
              <button type="submit" className="btn-primary lg">
                로그인
              </button>
            </div>
            <div className="member-link-box">
              <Link to="/join">회원가입</Link>
              <Link to="/updatePw">비밀번호 재설정 </Link>
            </div>
          </form>
        </dlv>
        <div className="kakao-login-join">
          <Link>카카오톡으로 시작하기</Link>
        </div>
        <div className="naver-login-join">
          <Link>네이버로 시작하기</Link>
        </div>
      </div>
    </section>
  );
};

export default Login;
