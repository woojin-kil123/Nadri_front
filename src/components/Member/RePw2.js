import axios from "axios";
import { useEffect, useRef, useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";

const Join2 = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { email } = location.state || {}; // 이메일 데이터를 가져옴 (없으면 기본값으로 {} 설정)
  console.log(email);
  const [member, setMember] = useState({
    memberEmail: "",
    memberPw: "",
  });

  useEffect(() => {
    if (email) {
      setMember((prevState) => ({ ...prevState, memberEmail: email }));
    }
  }, [email]);

  const [memberPwRe, setMemberPwRe] = useState("");
  const inputMemberPwRe = (e) => {
    setMemberPwRe(e.target.value);
  };
  const inputMemberData = (e) => {
    const name = e.target.name;
    const inputData = e.target.value;
    setMember({ ...member, [name]: inputData });
  };

  const pwMsgRef = useRef(null);
  const checkPw = () => {
    pwMsgRef.current.classList.remove("valid");
    pwMsgRef.current.classList.remove("invalid");

    if (member.memberPw === memberPwRe) {
      pwMsgRef.current.classList.add("valid");
      pwMsgRef.current.innerText = "비밀번호가 일치합니다.";
    } else {
      pwMsgRef.current.classList.add("invalid");
      pwMsgRef.current.innerText = "비밀번호가 일치하지 않습니다.";
    }
  };

  const rePwMember = () => {
    console.log(member);
    axios
      .patch(`${process.env.REACT_APP_BACK_SERVER}/member/updatePw`, member)
      .then((res) => {
        console.log(res);
        navigate("/");
      })
      .catch((err) => {
        console.log(err);
      });
  };

  return (
    <section className="section">
      <div className="join-title">
        <h3>필수 정보 입력</h3>
        <p>가입을 위해 필수 정보를 입력해주세요.</p>
      </div>
      <div className="join-wrap">
        <form
          onSubmit={(e) => {
            e.preventDefault();
            rePwMember();
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
                onBlur={checkPw}
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

          <div className="join-button-box">
            <button type="submit" className="btn-primary lg">
              확인
            </button>
          </div>
        </form>
      </div>
    </section>
  );
};

export default Join2;
