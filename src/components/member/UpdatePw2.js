import axios from "axios";
import { useEffect, useRef, useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import Swal from "sweetalert2";

const UpdatePw2 = () => {
  const navigate = useNavigate(); // 페이지 이동을 위한 navigate 훅
  const location = useLocation(); // 현재 위치에서 전달된 데이터를 가져오는 훅
  const { email, code } = location.state || {}; // 이메일과 코드 데이터를 가져옴 (없으면 기본값으로 빈 객체 설정)

  console.log(email);
  console.log(code);

  useEffect(() => {
    if (!code) {
      Swal.fire({
        title: "코드 누락",
        text: "인증 코드가 누락되었습니다. 메인 페이지로 이동합니다.",
        icon: "error",
      }).then(() => {
        navigate("/"); // 메인 페이지로 이동
      });
    }
  }, [code, navigate]);

  // 상태 관리: 회원 이메일과 비밀번호 저장
  const [member, setMember] = useState({
    memberEmail: "", // 기본 이메일 설정 (이메일 인증 페이지에서 전달된 이메일로 업데이트됨)
    memberPw: "", // 비밀번호 상태
  });

  // useEffect를 사용해 email 값이 변경되면 member 상태 업데이트
  useEffect(() => {
    if (email) {
      setMember((prevState) => ({ ...prevState, memberEmail: email }));
    }
  }, [email]);

  // 비밀번호 확인 입력 값 상태 관리
  const [memberPwRe, setMemberPwRe] = useState("");
  const [isFormValid, setIsFormValid] = useState(false); // 폼 유효성 상태

  // 비밀번호 확인 입력값 업데이트 핸들러
  const inputMemberPwRe = (e) => {
    setMemberPwRe(e.target.value); // 확인 비밀번호 상태 업데이트
  };

  // 비밀번호 입력 값 업데이트 핸들러
  const inputMemberData = (e) => {
    const name = e.target.name; // 입력 필드의 name 속성
    const inputData = e.target.value; // 입력 필드의 값
    setMember({ ...member, [name]: inputData }); // 해당 필드의 값 업데이트
  };

  // 비밀번호 일치 여부를 체크하고, 메시지 표시를 위한 ref
  const pwMsgRef = useRef(null);

  // 비밀번호 일치 여부를 확인하는 함수
  const checkPw = () => {
    pwMsgRef.current.classList.remove("input-ok"); // 이전 상태에서 input-ok, input-error 클래스 제거
    pwMsgRef.current.classList.remove("input-error");

    if (member.memberPw && memberPwRe) {
      // 비밀번호와 비밀번호 확인 값이 null 또는 빈 문자열이 아니면
      if (member.memberPw === memberPwRe) {
        // 비밀번호가 일치하면 "input-ok" 클래스 추가하고 일치 메시지 표시
        pwMsgRef.current.classList.add("input-ok");
        pwMsgRef.current.innerText = "비밀번호가 일치합니다.";
        setIsFormValid(true); // 비밀번호 일치하면 버튼을 활성화
      } else {
        // 비밀번호가 일치하지 않으면 "input-error" 클래스 추가하고 불일치 메시지 표시
        pwMsgRef.current.classList.add("input-error");
        pwMsgRef.current.innerText = "비밀번호가 일치하지 않습니다.";
        setIsFormValid(false); // 비밀번호 불일치하면 버튼을 비활성화
      }
    } else {
      // 비밀번호 또는 비밀번호 확인이 입력되지 않은 경우
      pwMsgRef.current.classList.remove("input-ok");
      pwMsgRef.current.classList.add("input-error");
      pwMsgRef.current.innerText = "비밀번호를 입력해주세요.";
      setIsFormValid(false); // 비밀번호가 입력되지 않으면 버튼을 비활성화
    }
  };

  const rePwMember = () => {
    console.log(member); // 변경할 회원 정보 확인
    axios
      .patch(`${process.env.REACT_APP_BACK_SERVER}/member/updatePw`, member) // 비밀번호 업데이트 API 호출
      .then((res) => {
        Swal.fire({
          title: "비밀번호 변경 완료",
          text: "비밀번호가 성공적으로 변경되었습니다.",
          icon: "success",
        }).then(() => {
          navigate("/"); // 비밀번호 변경 완료 후 홈 페이지로 이동
        });
      })
      .catch((err) => {
        Swal.fire({
          title: "오류",
          text: "비밀번호 변경 중 오류가 발생했습니다. 다시 시도해주세요.",
          icon: "error",
        });
      });
  };

  return (
    <section className="section">
      {code ? (
        <>
          <div className="join-title">
            <h3>필수 정보 입력</h3>
            <p>가입을 위해 필수 정보를 입력해주세요.</p>
          </div>
          <div className="join-wrap">
            <form
              onSubmit={(e) => {
                e.preventDefault(); // 기본 폼 제출을 막고, 비밀번호 변경 함수 호출
                rePwMember();
              }}
            >
              {/* 비밀번호 입력 */}
              <div className="input-wrap">
                <div className="input-title">
                  <label htmlFor="memberPw">비밀번호</label>
                </div>
                <div className="input-item">
                  <input
                    type="password" // 비밀번호 필드 (숨김 처리)
                    name="memberPw" // 입력 필드의 name 속성
                    id="memberPw" // 입력 필드의 id 속성
                    value={member.memberPw} // 상태에서 비밀번호 값 가져오기
                    onChange={inputMemberData} // 비밀번호 값이 변경될 때마다 상태 업데이트
                    onBlur={checkPw} // 포커스를 벗어날 때 비밀번호 일치 여부 확인
                  />
                </div>
              </div>

              {/* 비밀번호 확인 입력 */}
              <div className="input-wrap">
                <div className="input-title">
                  <label htmlFor="memberPwRe">비밀번호 확인</label>
                </div>
                <div className="input-item">
                  <input
                    type="password" // 비밀번호 확인 필드 (숨김 처리)
                    name="memberPwRe" // 입력 필드의 name 속성
                    id="memberPwRe" // 입력 필드의 id 속성
                    value={memberPwRe} // 비밀번호 확인 값 상태
                    onChange={inputMemberPwRe} // 비밀번호 확인 값 변경 시 상태 업데이트
                    onBlur={checkPw} // 포커스를 벗어날 때 비밀번호 일치 여부 확인
                  />
                </div>
                {/* 비밀번호 일치 여부 메시지 표시 */}
                <p ref={pwMsgRef}></p>
              </div>

              {/* "확인" 버튼 */}
              <div className="join-button-box">
                <button
                  type="submit"
                  className="btn-primary lg"
                  style={{ display: isFormValid ? "block" : "none" }} // 버튼이 비밀번호 일치 시만 보이도록 설정
                  disabled={!isFormValid} // 버튼이 비활성화되면 클릭 불가
                >
                  확인
                </button>
              </div>
            </form>
          </div>
        </>
      ) : (
        <div className="join-title">
          <h3>코드 누락</h3>
          <p>코드가 인증되지 않았습니다.</p>
        </div>
      )}
    </section>
  );
};

export default UpdatePw2;
