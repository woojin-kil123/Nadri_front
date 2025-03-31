import axios from "axios";
import { useEffect, useRef, useState } from "react";
import { Link, Navigate, useNavigate } from "react-router-dom";
import Swal from "sweetalert2";
import WarningIcon from "@mui/icons-material/Warning";

const Join = () => {
  const navigate = useNavigate();
  const [member, setMember] = useState({
    memberEmail: "", // 이메일
    memberCode: "", // 인증 코드
  });
  const [code, setCode] = useState(); // 서버에서 받은 인증 코드
  const [codeSentTime, setCodeSentTime] = useState(null); // 인증 코드가 전송된 시간
  const [isVerificationSent, setIsVerificationSent] = useState(false); // 이메일 인증 요청 여부
  const [isButtonEnabled, setIsButtonEnabled] = useState(false); // "다음" 버튼 활성화 여부
  const [emailCheck, setEmailCheck] = useState(0); // 이메일 중복 확인 상태
  const [emailCheckMessage, setEmailCheckMessage] = useState(""); // 이메일 중복 검사 메시지
  const [emailCheckColor, setEmailCheckColor] = useState(""); // 이메일 중복 검사 메시지 색상
  const [isEmailVerified, setIsEmailVerified] = useState(false); // 이메일 인증 버튼 표시 여부
  const [timeLeft, setTimeLeft] = useState(180); // 카운트다운 타이머 변수 10분 (600초) 설정

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
    axios
      .get(
        `${process.env.REACT_APP_BACK_SERVER}/api/sendCode?email=${member.memberEmail}`
      )
      .then((res) => {
        setCode(res.data); // 서버에서 받은 인증 코드 저장
        setCodeSentTime(Date.now()); // 인증 코드가 전송된 시간 저장
        setIsVerificationSent(true); // 인증 코드 요청 후 인증 코드 입력란 표시
      })
      .catch((error) => {});
  };

  const verifyEmailCode = () => {
    // 인증 코드가 만료되었는지 확인
    const currentTime = Date.now();
    if (currentTime - codeSentTime > 3 * 60 * 1000) {
      setCode(null); // 인증 코드 만료
      Swal.fire({
        text: "인증 코드가 만료되었습니다. 다시 시도해주세요.",
        icon: "error",
      });
      return;
    }

    if (code === member.memberCode) {
      Swal.fire({
        text: "인증이 완료되었습니다!",
        icon: "success",
      }).then((result) => {
        if (result.isConfirmed) {
          // 인증 완료 후 회원 가입 2단계로 이동
          navigate("/join2", {
            state: { email: member.memberEmail, code: member.memberCode },
          });
        }
      });
    } else {
      Swal.fire({
        text: "인증 코드가 일치하지 않습니다. 다시 확인해 주세요",
        icon: "info",
      });
    }
  };

  // 타이머 업데이트 및 만료 확인
  useEffect(() => {
    if (isVerificationSent && timeLeft > 0) {
      const timer = setInterval(() => {
        setTimeLeft((prevTime) => prevTime - 1); // 1초마다 1초씩 감소
      }, 1000);

      return () => clearInterval(timer); // 컴포넌트 언마운트 시 타이머 정리
    } else if (timeLeft <= 0) {
      setIsVerificationSent(false); // 인증 코드 만료
      Swal.fire({
        text: "인증 코드가 만료되었습니다. 다시 시도해주세요.",
        icon: "error",
      });
    }
  }, [isVerificationSent, timeLeft]);

  // 카운트다운 포맷 (분:초 형식)
  const formatTime = (seconds) => {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes}:${remainingSeconds < 10 ? "0" : ""}${remainingSeconds}`;
  };

  return (
    <section className="section">
      <div className="join-title">
        <h2>이메일 인증</h2>
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
                onKeyDown={(e) => {
                  if (e.key === "Enter") {
                    checkEmail(); // Enter 키를 누르면 중복 검사 실행
                  }
                }}
              />
            </div>
            {/* 이메일 중복 검사 결과 메시지 */}
            <p style={{ color: emailCheckColor, fontSize: "14px" }}>
              {emailCheckMessage}
            </p>
          </div>
          <div className="email-verify-content">
            <WarningIcon />
            <p>
              회원 가입시 ID는 반드시 본인 소유의 연락 가능한 이메일 주소를
              사용하여야 합니다.
            </p>
          </div>

          {/* 이메일 인증 버튼 (이메일 중복 확인이 된 경우에만 활성화) */}

          <div className="verify-button-box">
            <button
              type="button"
              onClick={sendEmailVerification}
              disabled={!isEmailVerified} // 비활성화 조건
              style={{
                pointerEvents: !isEmailVerified ? "none" : "auto", // 버튼 비활성화 시 클릭 불가
                opacity: !isEmailVerified ? 0.5 : 1, // 비활성화된 버튼은 투명도 낮추기
              }}
            >
              이메일 인증
            </button>
          </div>

          {/* 인증 코드 입력란 (이메일 인증 버튼을 클릭한 후에만 표시) */}
          {isVerificationSent && (
            <>
              <div className="code-input-title">
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
              <div className="countdown-timer">
                <p>남은 시간: {formatTime(timeLeft)}</p>
              </div>
              <div className="countdown-content">
                <p>
                  인증번호는 <b>입력한 이메일 주소</b>로 발송됩니다. 수신하지
                  못했다면 스팸함 또는 해당 이메일 서비스의 설정을 확인해주세요.
                </p>
              </div>
            </>
          )}

          <div className="join-button-box">
            {/* 인증 코드 입력 후 "다음" 버튼 활성화 */}
            <button
              type="submit"
              className="btn-primary lg"
              disabled={!isButtonEnabled} // 버튼 비활성화
              style={{
                pointerEvents: isButtonEnabled ? "auto" : "none", // 버튼 비활성화 시 클릭 불가
                opacity: isButtonEnabled ? 1 : 0.5, // 비활성화된 버튼은 투명도 낮추기
              }}
            >
              다음
            </button>
          </div>
        </form>
      </div>
    </section>
  );
};

export default Join;
