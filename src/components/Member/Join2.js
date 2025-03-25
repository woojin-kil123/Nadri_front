import { useRef, useState } from "react";
import { Link } from "react-router-dom";

const Join2 = () => {
  const [member, setMember] = useState({
    memberNickname: "",
    memberPw: "",
    memberNickname: "",
    memberPhone: "",
  });
  const [memberPwRe, setMemberPwRe] = useState("");
  const inputMemberPwRe = (e) => {
    setMemberPwRe(e.target.value);
  };
  const inputMemberData = (e) => {
    const name = e.target.name;
    const inputData = e.target.value;
    setMember({ ...member, [name]: inputData });
  };
  const [idCheck, setIdCheck] = useState(0);
  const pwMsgRef = useRef(null);
  const checkPw = () => {
    pwMsgRef.current.classList.remove("valid");
    pwMsgRef.current.classList.remove("invalid");
    console.log(member.memberPw);
    console.log(memberPwRe);
    if (member.memberPw === memberPwRe) {
      pwMsgRef.current.classList.add("valid");
      pwMsgRef.current.innerText = "비밀번호가 일치합니다.";
    } else {
      pwMsgRef.current.classList.add("invalid");
      pwMsgRef.current.innerText = "비밀번호가 일치하지 않습니다.";
    }
    console.log(pwMsgRef.current.innerText);
  };
  const joinMember = () => {};
  return (
    <section className="section">
      <div className="join-wrap">
        <form
          onSubmit={(e) => {
            e.preventDefault();
            joinMember();
          }}
        >
          <div className="input-wrap">
            <div className="input-title">
              <label htmlFor="memberPw">비밀번호</label>
            </div>
            <div className="input-item">
              <input
                text="password"
                name="memberPw"
                id="memberPw"
                value={member.memberPw}
                onChange={inputMemberData}
                onblur={checkPw}
              ></input>
            </div>
          </div>

          <div className="input-wrap">
            <div className="input-title">
              <label htmlFor="memberPwRe">비밀번호 확인</label>
            </div>
            <div className="input-item">
              <input
                text="password"
                name="memberPwRe"
                id="memberPwRe"
                value={memberPwRe}
                onChange={inputMemberPwRe}
                onBlur={checkPw}
              ></input>
            </div>
            <p className="input-msg" ref={pwMsgRef}></p>
          </div>

          <div className="input-wrap">
            <div className="input-title">
              <label htmlFor="memberNickname">닉네임</label>
            </div>
            <div className="input-item">
              <input
                text="text"
                name="memberNickname"
                id="memberNickname"
                value={member.memberNickname}
                onChange={inputMemberData}
              ></input>
            </div>
          </div>

          <div className="input-wrap">
            <div className="input-title">
              <label htmlFor="memberPhone">전화번호</label>
            </div>
            <div className="input-item">
              <input
                text="text"
                name="memberPhone"
                id="memberPhone"
                value={member.memberPhone}
                onChange={inputMemberData}
              ></input>
            </div>
          </div>

          <div className="join-button-box">
            <button type="submit" className="btn-primary lg">
              회원가입
            </button>
          </div>
        </form>
      </div>
    </section>
  );
};

export default Join2;
