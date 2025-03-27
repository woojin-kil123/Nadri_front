import axios from "axios";
import { useEffect, useRef, useState } from "react";
import { Link, Navigate, useNavigate } from "react-router-dom";

const Join = () => {
  const navigate = useNavigate();
  const [member, setMember] = useState({
    memberEmail: "",
    memberCode: "",
  });
  const [code, setCode] = useState();
  const [isVerificationSent, setIsVerificationSent] = useState(false);
  const [isButtonEnabled, setIsButtonEnabled] = useState(false);
  const [emailCheck, setEmailCheck] = useState(0);
  const [emailCheckMessage, setEmailCheckMessage] = useState(""); // 이메일 중복 검사 결과 메시지
  const [emailCheckColor, setEmailCheckColor] = useState(""); // 메시지 색상 (유효/오류)
  const [isEmailVerified, setIsEmailVerified] = useState(false); // 이메일 인증 버튼 표시 여부

  const inputMemberData = (e) => {
    const { name, value } = e.target;
    setMember({ ...member, [name]: value });

    if (name === "memberEmail") {
      setIsEmailVerified(false);
      setIsVerificationSent(false);
      setEmailCheckMessage("");
    }

    if (name === "memberCode" && value.length === 6) {
      setIsButtonEnabled(true);
    } else {
      setIsButtonEnabled(false);
    }
  };

  // 이메일 중복 확인
  const checkEmail = () => {
    const email = member.memberEmail.trim();
    // 이메일 형식 검사 (@ 포함 여부)
    if (!email.includes("@")) {
      setEmailCheckMessage("올바른 이메일 형식을 입력해주세요.");
      setEmailCheckColor("red");
      setEmailCheck(0);
      return;
    }

    axios
      .get(
        `${process.env.REACT_APP_BACK_SERVER}/member/existsEmail?memberEmail=${email}`
      )
      .then((res) => {
        console.log(res.data);
        setEmailCheckMessage("이메일을 인증해주세요.");
        setEmailCheckColor("green");
        setIsEmailVerified(true);
      })
      .catch((err) => {
        console.log(err);
        setEmailCheckMessage("이메일 확인 중 오류가 발생했습니다.");
        setEmailCheckColor("red");
        setIsEmailVerified(false);
      });
  };

  // 이메일 인증 요청 (이메일 중복 검사 후 실행 가능)
  const sendEmailVerification = () => {
    axios
      .get(
        `${process.env.REACT_APP_BACK_SERVER}/api/sendCode?email=${member.memberEmail}`
      )
      .then((res) => {
        console.log(res);
        setCode(res.data);
        setIsVerificationSent(true);
      })
      .catch((error) => {
        console.error("이메일 인증 요청 실패:", error);
      });
  };

  // 인증 코드 확인
  const verifyEmailCode = () => {
    if (code === member.memberCode) {
      alert("인증이 완료되었습니다!");
      navigate("/repw2", { state: { email: member.memberEmail } });
    } else {
      alert("인증 코드가 일치하지 않습니다. 다시 확인해 주세요.");
    }
  };

  return (
    <section className="section">
      <div className="join-title">
        <h3>비밀번호 재설정</h3>
        <p>회원가입 시 등록한 이메일을 입력해주세요.</p>
      </div>
      <div className="join-wrap">
        <form
          onSubmit={(e) => {
            e.preventDefault();
            verifyEmailCode();
          }}
        >
          {/* 이메일 입력 */}
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
                onChange={inputMemberData}
                onBlur={checkEmail} // 포커스를 벗어날 때 이메일 중복 검사 실행
              />
            </div>
            <p style={{ color: emailCheckColor, fontSize: "14px" }}>
              {emailCheckMessage}
            </p>
          </div>

          {/* 이메일 인증 버튼 (중복 확인이 통과된 경우에만 실행 가능) */}
          {isEmailVerified && (
            <div className="join-button-box">
              <button type="button" onClick={sendEmailVerification}>
                이메일 인증
              </button>
            </div>
          )}

          {/* 이메일 인증 후 인증 코드 입력 필드 */}
          {isVerificationSent && (
            <>
              <div className="input-title">
                <label htmlFor="emailCode">인증번호 6자리</label>
              </div>
              <div className="input-item">
                <input
                  type="text"
                  name="memberCode"
                  id="emailCode"
                  value={member.memberCode}
                  onChange={inputMemberData}
                  maxLength={6}
                />
              </div>
            </>
          )}

          {/* "다음" 버튼 (6자리 인증 코드 입력 시 활성화) */}
          {isButtonEnabled && (
            <button type="submit" className="btn-primary lg">
              다음
            </button>
          )}
        </form>
      </div>
    </section>
  );
};

export default Join;
