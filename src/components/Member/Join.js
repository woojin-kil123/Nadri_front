import axios from "axios";
import { useEffect, useRef, useState } from "react";
import { Link, Navigate, useNavigate } from "react-router-dom";

const Join = () => {
  const navigate = useNavigate();
  const [member, setMember] = useState({
    memberEmail: "", // 이메일
    memberCode: "", // 인증 코드
  });
  const [code, setCode] = useState(); // 서버에서 받은 인증 코드
  const [isVerificationSent, setIsVerificationSent] = useState(false); // 이메일 인증 요청 여부
  const [isButtonEnabled, setIsButtonEnabled] = useState(false); // "다음" 버튼 활성화 여부
  const [emailCheck, setEmailCheck] = useState(0); // 이메일 중복 확인 상태
  const [emailCheckMessage, setEmailCheckMessage] = useState(""); // 이메일 중복 검사 메시지
  const [emailCheckColor, setEmailCheckColor] = useState(""); // 이메일 중복 검사 메시지 색상
  const [isEmailVerified, setIsEmailVerified] = useState(false); // 이메일 인증 버튼 표시 여부

  // 입력값을 처리하는 함수
  const inputMemberData = (e) => {
    const { name, value } = e.target;
    setMember({ ...member, [name]: value });

    // 이메일 입력 시 인증 관련 상태 초기화
    if (name === "memberEmail") {
      setIsEmailVerified(false); // 이메일 인증 버튼 비활성화
      setIsVerificationSent(false); // 이메일 인증 상태 초기화
      setEmailCheckMessage(""); // 이메일 메시지 초기화
    }

    // 인증 코드 입력 시 6자리까지 입력 가능하도록 설정
    if (name === "memberCode" && value.length === 6) {
      setIsButtonEnabled(true); // 인증 코드가 6자일 경우 "다음" 버튼 활성화
    } else {
      setIsButtonEnabled(false); // 6자 미만일 경우 "다음" 버튼 비활성화
    }
  };

  // 이메일 중복 확인
  const checkEmail = () => {
    const email = member.memberEmail.trim();
    // 이메일 형식 검사 (@ 포함 여부)
    if (!email.includes("@")) {
      setEmailCheckMessage("올바른 이메일 형식을 입력해주세요.");
      setEmailCheckColor("red");
      setEmailCheck(0); // 이메일 중복 여부 상태 초기화
      return;
    }

    // 이메일 중복 체크 API 요청
    axios
      .get(
        `${process.env.REACT_APP_BACK_SERVER}/member/existsEmail?memberEmail=${email}`
      )
      .then((res) => {
        if (res.data === 0) {
          setEmailCheck(1); // 사용 가능한 이메일
          setEmailCheckMessage("사용 가능한 이메일입니다.");
          setEmailCheckColor("green");
          setIsEmailVerified(true); // 이메일 인증 버튼 활성화
        } else {
          setEmailCheck(2); // 이미 사용 중인 이메일
          setEmailCheckMessage("이미 사용 중인 이메일입니다.");
          setEmailCheckColor("red");
          setIsEmailVerified(false); // 이메일 인증 버튼 비활성화
        }
      })
      .catch((err) => {
        console.log(err);
        setEmailCheckMessage("이메일 확인 중 오류가 발생했습니다.");
        setEmailCheckColor("red");
        setIsEmailVerified(false);
      });
  };

  // 이메일 인증 요청
  const sendEmailVerification = () => {
    if (emailCheck !== 1) {
      alert("이메일 중복 확인을 먼저 해주세요."); // 이메일 중복 확인이 되어야만 인증 요청 가능
      return;
    }

    // 이메일 인증 코드 전송 API 요청
    axios
      .get(
        `${process.env.REACT_APP_BACK_SERVER}/api/sendCode?email=${member.memberEmail}`
      )
      .then((res) => {
        setCode(res.data); // 서버에서 받은 인증 코드 저장
        setIsVerificationSent(true); // 인증 코드 요청 후 인증 코드 입력란 표시
      })
      .catch((error) => {
        console.error("이메일 인증 요청 실패:", error);
      });
  };

  // 인증 코드 확인
  const verifyEmailCode = () => {
    if (code === member.memberCode) {
      alert("인증이 완료되었습니다!");
      navigate("/join2", { state: { email: member.memberEmail } }); // 인증 완료 후 회원 가입 2단계로 이동
    } else {
      alert("인증 코드가 일치하지 않습니다. 다시 확인해 주세요."); // 인증 코드 불일치 시 경고 메시지
    }
  };

  return (
    <section className="section">
      <div className="join-title">
        <h3>이메일 인증</h3>
        <p>가입을 위해 이메일을 인증해주세요.</p>
      </div>
      <div className="join-wrap">
        <form
          onSubmit={(e) => {
            e.preventDefault(); // 폼 제출 시 페이지 리로드 방지
            verifyEmailCode(); // 인증 코드 확인
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
                onChange={inputMemberData} // 입력값 변경 시 호출
                onBlur={checkEmail} // 포커스를 벗어나면 이메일 중복 검사 실행
              />
            </div>
            {/* 이메일 중복 검사 결과 메시지 */}
            <p style={{ color: emailCheckColor, fontSize: "14px" }}>
              {emailCheckMessage}
            </p>
          </div>

          {/* 이메일 인증 버튼 (이메일 중복 확인이 된 경우에만 활성화) */}
          {isEmailVerified && (
            <div className="join-button-box">
              <button type="button" onClick={sendEmailVerification}>
                이메일 인증
              </button>
            </div>
          )}

          {/* 인증 코드 입력란 (이메일 인증 버튼을 클릭한 후에만 표시) */}
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
                  onChange={inputMemberData} // 인증 코드 입력 시 상태 변경
                  maxLength={6} // 인증 코드는 6자리
                />
              </div>
            </>
          )}

          {/* 인증 코드 입력 후 "다음" 버튼 활성화 */}
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
