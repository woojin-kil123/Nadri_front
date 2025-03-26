import { useRef, useState } from "react";
import { Link } from "react-router-dom";

const Join = () => {
  const [member, setMember] = useState({
    memberEmail: "",
    emailCode: "", // 인증번호
    memberCode: "", // 입력된 인증번호
  });
  const [isCodeSent, setIsCodeSent] = useState(false); // 인증 코드가 전송되었는지 확인
  const [message, setMessage] = useState(""); // 인증 상태 메시지

  // 입력된 값 상태 업데이트
  const inputMemberData = (e) => {
    const name = e.target.name;
    const inputData = e.target.value;
    setMember({ ...member, [name]: inputData });
  };

  // 이메일 인증 코드 발송
  const sendVerificationCode = async () => {
    try {
      const response = await fetch("/api/send-verification-code", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: member.memberEmail }),
      });

      const data = await response.json();

      if (data.success) {
        setIsCodeSent(true); // 인증 코드가 발송됨
        setMessage("인증 코드가 이메일로 전송되었습니다.");
      } else {
        setMessage("이메일 전송에 실패했습니다.");
      }
    } catch (error) {
      setMessage("서버 오류가 발생했습니다.");
    }
  };

  // 인증 코드 확인
  const verifyCode = async () => {
    try {
      const response = await fetch("/api/verify-code", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email: member.memberEmail,
          verificationCode: member.emailCode,
        }),
      });

      const data = await response.json();

      if (data.success) {
        setMessage("인증 성공! 다음 단계로 진행하세요.");
      } else {
        setMessage("인증 코드가 잘못되었습니다.");
      }
    } catch (error) {
      setMessage("서버 오류가 발생했습니다.");
    }
  };

  // 인증번호 확인 버튼 클릭 처리
  const handleCodeVerification = (e) => {
    e.preventDefault();
    if (member.emailCode && member.emailCode.length === 6) {
      verifyCode(); // 인증 코드 확인
    } else {
      setMessage("6자리 인증 코드를 입력해주세요.");
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
            e.preventDefault();
          }}
        >
          {/* 이메일 입력 필드 */}
          <div className="input-wrap">
            <div className="input-title">
              <label htmlFor="memberEmail">이메일</label>
            </div>
            <div className="input-item">
              <input
                type="email"
                name="memberEmail"
                id="memberEmail"
                value={member.memberEmail}
                onChange={inputMemberData}
                required
              />
            </div>
          </div>

          {/* 이메일 인증 요청 버튼 */}
          <div className="join-button-box">
            <button
              type="button"
              onClick={sendVerificationCode}
              disabled={isCodeSent}
            >
              {isCodeSent ? "인증 코드 전송 완료" : "이메일 인증"}
            </button>
          </div>

          {/* 인증번호 입력 필드 */}
          {isCodeSent && (
            <div>
              <div className="input-title">
                <label htmlFor="emailCode">인증번호 6자리</label>
              </div>
              <div className="input-item">
                <input
                  type="text"
                  name="emailCode"
                  id="emailCode"
                  value={member.emailCode}
                  onChange={inputMemberData}
                  maxLength="6"
                  required
                />
              </div>
              <div>
                <button onClick={handleCodeVerification}>인증번호 확인</button>
              </div>
            </div>
          )}
        </form>

        {/* 인증 상태 메시지 */}
        {message && <p>{message}</p>}

        {/* 인증이 완료되면 다음 페이지로 이동 */}
        {message === "인증 성공! 다음 단계로 진행하세요." && (
          <Link to="/Join2" className="btn-primary lg">
            다음
          </Link>
        )}
      </div>
    </section>
  );
};

export default Join;
