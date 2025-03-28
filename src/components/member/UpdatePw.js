import axios from "axios";
import { useEffect, useRef, useState } from "react";
import { Link, Navigate, useNavigate } from "react-router-dom";
import Swal from "sweetalert2";

const UpdatePw = () => {
  const navigate = useNavigate(); // 페이지 이동을 위한 navigate 훅
  const [member, setMember] = useState({
    memberEmail: "", // 사용자 이메일 상태
    memberCode: "", // 이메일 인증 코드 상태
  });
  const [code, setCode] = useState(); // 서버에서 받은 인증 코드
  const [isVerificationSent, setIsVerificationSent] = useState(false); // 이메일 인증 코드 발송 여부
  const [isButtonEnabled, setIsButtonEnabled] = useState(false); // "다음" 버튼 활성화 여부
  const [emailCheck, setEmailCheck] = useState(0); // 이메일 중복 체크 상태
  const [emailCheckMessage, setEmailCheckMessage] = useState(""); // 이메일 중복 검사 메시지
  const [emailCheckColor, setEmailCheckColor] = useState(""); // 이메일 중복 검사 메시지 색상 (유효/오류)
  const [isEmailVerified, setIsEmailVerified] = useState(false); // 이메일 인증 버튼 표시 여부

  // 입력값 변경 처리 함수
  const inputMemberData = (e) => {
    const { name, value } = e.target; // input 태그의 name과 value 값 가져오기
    setMember({ ...member, [name]: value }); // 상태 업데이트

    // 이메일 입력란의 값이 변경되면 인증 관련 상태 초기화
    if (name === "memberEmail") {
      setIsEmailVerified(false); // 이메일 인증 여부 초기화
      setIsVerificationSent(false); // 인증 코드 발송 여부 초기화
      setEmailCheckMessage(""); // 이메일 검사 메시지 초기화
    }

    // 인증 코드가 6자리일 때 "다음" 버튼 활성화
    if (name === "memberCode" && value.length === 6) {
      setIsButtonEnabled(true);
    } else {
      setIsButtonEnabled(false); // 6자리가 아니면 "다음" 버튼 비활성화
    }
  };

  // 이메일 중복 검사 함수
  const checkEmail = () => {
    const email = member.memberEmail.trim(); // 공백 제거한 이메일

    // 이메일 형식 검사 (@ 포함 여부 확인)
    if (!email.includes("@")) {
      setEmailCheckMessage("올바른 이메일 형식을 입력해주세요.");
      setEmailCheckColor("red"); // 오류 메시지 색상
      setEmailCheck(0); // 중복 검사 상태 초기화
      return;
    }

    // 이메일 중복 확인 API 요청
    axios
      .get(
        `${process.env.REACT_APP_BACK_SERVER}/member/existsEmail?memberEmail=${email}`
      )
      .then((res) => {
        console.log(res.data);
        setEmailCheckMessage("이메일을 인증해주세요."); // 이메일 중복 없이 인증 요청
        setEmailCheckColor("green"); // 유효한 이메일은 초록색 메시지
        setIsEmailVerified(true); // 이메일 인증 가능 상태로 설정
      })
      .catch((err) => {
        console.log(err);
        setEmailCheckMessage("이메일 확인 중 오류가 발생했습니다.");
        setEmailCheckColor("red"); // 오류 메시지 색상
        setIsEmailVerified(false); // 이메일 인증 불가능 상태
      });
  };

  // 이메일 인증 요청 함수
  const sendEmailVerification = () => {
    axios
      .get(
        `${process.env.REACT_APP_BACK_SERVER}/api/sendCode?email=${member.memberEmail}`
      )
      .then((res) => {
        console.log(res);
        setCode(res.data); // 서버에서 받은 인증 코드 저장
        setIsVerificationSent(true); // 인증 코드 발송 상태로 변경
      })
      .catch((error) => {
        console.error("이메일 인증 요청 실패:", error); // 오류 발생 시 콘솔에 출력
      });
  };

  // 인증 코드 확인 함수
  const verifyEmailCode = () => {
    if (code === member.memberCode) {
      alert("인증이 완료되었습니다!"); // 인증 성공 시 알림
      navigate("/updatePw2", { state: { email: member.memberEmail } }); // 인증 성공 시 비밀번호 재설정 페이지로 이동
    } else {
      Swal.fire({
        text: "인증 코드가 일치하지 않습니다. 다시 확인해 주세요",
        icon: "info",
      });
      // 인증 코드 불일치 시 알림
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
            e.preventDefault(); // 기본 폼 제출 동작 방지
            verifyEmailCode(); // 인증 코드 확인 함수 호출
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
                onChange={inputMemberData} // 입력값 변경 시 상태 업데이트
                onBlur={checkEmail} // 포커스를 벗어날 때 이메일 중복 검사 실행
              />
            </div>
            {/* 이메일 중복 검사 결과 메시지 */}
            <p style={{ color: emailCheckColor, fontSize: "14px" }}>
              {emailCheckMessage}
            </p>
          </div>

          {/* 이메일 인증 버튼 (중복 확인이 통과된 경우에만 표시) */}
          {isEmailVerified && (
            <div className="join-button-box">
              <button type="button" onClick={sendEmailVerification}>
                이메일 인증
              </button>
            </div>
          )}

          {/* 이메일 인증 후 인증 코드 입력란 */}
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
                  onChange={inputMemberData} // 입력값 변경 시 상태 업데이트
                  maxLength={6} // 인증 코드는 6자리만 입력 가능
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

export default UpdatePw;
