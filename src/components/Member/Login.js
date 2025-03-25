import { Link, Route, Routes } from "react-router-dom";
import "./member.css";
import { useState } from "react";

const Login = () => {
  const [member, setMember] = useState({ memberId: "", memberPw: "" });
  const changeMember = (e) => {
    const name = e.target.name;
    const inputData = e.target.value;
    setMember({ ...member, [name]: inputData });
  };
  const Login = () => {};

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
                <label htmlFor="memberId">이메일</label>
              </div>
              <div className="input-item">
                <input
                  type="text"
                  name="memberId"
                  id="memberId"
                  value={member.memberId}
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
              <Link to="#">비밀번호 재설정 </Link>
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
