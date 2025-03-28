import axios from "axios";
import { useEffect, useRef, useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";

const Join2 = () => {
  const navigate = useNavigate(); // 페이지 이동을 위한 navigate 훅
  const location = useLocation(); // 현재 위치에서 전달된 데이터를 가져오는 훅
  const { email } = location.state || {}; // 이메일 데이터를 가져옴 (없으면 기본값으로 빈 객체 설정)
  console.log(email);

  // 회원 정보를 관리하는 상태 변수
  const [member, setMember] = useState({
    memberEmail: "user03@naver.com", // 기본 이메일 설정 (이메일 인증 페이지에서 전달된 이메일로 업데이트됨)
    memberPw: "", // 비밀번호 상태
    memberNickname: "", // 닉네임 상태
    memberPhone: "", // 휴대폰 번호 상태
    memberBirth: "", // 생년월일 상태
    memberGender: "", // 성별 상태
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
    setMemberPwRe(e.target.value);
  };

  // 회원 정보 입력 필드 업데이트 핸들러
  const inputMemberData = (e) => {
    const name = e.target.name; // 입력 필드의 name 속성
    const inputData = e.target.value; // 입력 필드의 값
    setMember({ ...member, [name]: inputData }); // 해당 필드의 값 상태 업데이트
  };

  // 비밀번호 일치 여부를 체크하고, 메시지 표시를 위한 ref
  const pwMsgRef = useRef(null);

  // 비밀번호 일치 여부를 확인하는 함수
  const checkPw = () => {
    pwMsgRef.current.classList.remove("input-ok"); // 이전 상태에서 input-ok, input-error, input-error2 클래스 제거
    pwMsgRef.current.classList.remove("input-error");

    if (member.memberPw && memberPwRe) {
      // 비밀번호와 비밀번호 확인 값이 null 또는 빈 문자열이 아니면
      if (member.memberPw === memberPwRe) {
        // 비밀번호가 일치하면 "input-ok" 클래스 추가하고 일치 메시지 표시
        pwMsgRef.current.classList.add("input-ok");
        pwMsgRef.current.innerText = "비밀번호가 일치합니다.";
      } else {
        // 비밀번호가 일치하지 않으면 "input-error" 클래스 추가하고 불일치 메시지 표시
        pwMsgRef.current.classList.add("input-error");
        pwMsgRef.current.innerText = "비밀번호가 일치하지 않습니다.";
      }
    } else {
      // 비밀번호 또는 비밀번호 확인이 입력되지 않은 경우
      pwMsgRef.current.classList.remove("input-ok");
      pwMsgRef.current.classList.add("input-error");
      pwMsgRef.current.innerText = "비밀번호를 입력해주세요.";
    }
  };

  // 닉네임 중복 체크 및 유효성 검사
  const [nicknameCheck, setNicknameCheck] = useState(0);
  const checkNickname = () => {
    const idReg = /^[a-zA-Z0-9가-힣]+$/; // 닉네임에 사용할 수 있는 문자: 한글, 영어 대소문자, 숫자
    if (idReg.test(member.memberNickname)) {
      // 정규식에 맞으면 중복 체크 요청
      axios
        .get(
          `${process.env.REACT_APP_BACK_SERVER}/member/exists?memberNickname=${member.memberNickname}`
        )
        .then((res) => {
          console.log(res);
          if (res.data === 0) {
            setNicknameCheck(1); // 사용 가능한 닉네임
          } else {
            setNicknameCheck(3); // 이미 사용중인 닉네임
          }
        })
        .catch((err) => {
          console.log(err); // 에러 발생 시 콘솔 출력
        });
    } else {
      setNicknameCheck(2); // 유효하지 않은 닉네임
    }
  };

  // 휴대폰 번호 유효성 검사 및 형식 변경
  const [phoneError, setPhoneError] = useState(0);
  const checkPhone = () => {
    const phoneRegex = /^(010-\d{4}-\d{4})$/; // 010-0000-0000 형식의 정규표현식
    const formattedPhone = member.memberPhone.replace(/[^0-9]/g, ""); // 숫자만 추출
    let formattedPhoneWithDash = "";
    if (formattedPhone.length === 11) {
      formattedPhoneWithDash = `${formattedPhone.slice(
        0,
        3
      )}-${formattedPhone.slice(3, 7)}-${formattedPhone.slice(7)}`;
    } else {
      formattedPhoneWithDash = member.memberPhone;
    }

    setMember({ ...member, memberPhone: formattedPhoneWithDash });

    if (!phoneRegex.test(formattedPhoneWithDash)) {
      setPhoneError(2); // 잘못된 형식일 경우 에러
    } else {
      setPhoneError(1); // 유효한 형식일 경우 에러 메시지 제거
    }
  };

  // 회원가입 요청 함수
  const joinMember = () => {
    if (!member.memberBirth) {
      alert("생년월일을 선택하세요.");
      return;
    }

    console.log(member); // 회원 정보 확인
    axios
      .post(`${process.env.REACT_APP_BACK_SERVER}/member/join`, member) // 서버에 회원가입 요청
      .then((res) => {
        console.log(res); // 응답 확인
        navigate("/"); // 회원가입 성공 후 홈으로 리디렉션
      })
      .catch((err) => {
        console.log(err); // 에러 발생 시 콘솔 출력
      });
  };

  // 생년월일 관련 상태 변수 및 생성
  const [year, setYear] = useState("");
  const [month, setMonth] = useState("");
  const [day, setDay] = useState("");
  const currentYear = new Date().getFullYear(); // 현재 연도
  const years = Array.from(
    { length: currentYear - 1900 + 1 },
    (_, i) => currentYear - i
  ); // 연도 목록
  const months = Array.from({ length: 12 }, (_, i) => i + 1); // 월 목록
  const getDaysInMonth = (year, month) => {
    const daysInMonth = new Date(year, month, 0).getDate(); // 해당 월의 일수 구하기
    return Array.from({ length: daysInMonth }, (_, i) => i + 1); // 일수 목록
  };
  const [days, setDays] = useState([]);
  useEffect(() => {
    if (year && month) {
      const updatedDays = getDaysInMonth(year, month);
      setDays(updatedDays); // 월에 맞는 일 목록 업데이트
      if (!updatedDays.includes(parseInt(day))) {
        setDay(updatedDays[0] || "");
      }
    }
  }, [year, month, day]);

  // 생년월일 값이 설정되면 member 상태에 반영
  useEffect(() => {
    if (year !== "" && month !== "" && day !== "") {
      const formattedMonth = String(month).padStart(2, "0");
      const formattedDay = String(day).padStart(2, "0");
      const birthString = `${year}${formattedMonth}${formattedDay}`; // 생년월일 문자열 형식

      setMember((prevState) => ({ ...prevState, memberBirth: birthString }));
    }
  }, [year, month, day]);

  // member 상태 업데이트 후 바로 실행되는 effect
  useEffect(() => {
    if (member.memberBirth) {
      // memberBirth가 변경될 때마다 콘솔 로그로 출력
      console.log(member);
    }
  }, [member.memberBirth]); // memberBirth 상태에 의존

  useEffect(() => {
    const isValid =
      member.memberPw &&
      memberPwRe &&
      member.memberPw === memberPwRe &&
      member.memberNickname &&
      nicknameCheck === 1 &&
      member.memberPhone &&
      phoneError === 1 &&
      member.memberBirth &&
      member.memberGender;

    setIsFormValid(isValid); // 폼 유효성 상태 업데이트
  }, [member, memberPwRe, nicknameCheck, phoneError, year, month, day]);

  return (
    <section className="section">
      <div className="join-title">
        <h3>필수 정보 입력</h3>
        <p>가입을 위해 필수 정보를 입력해주세요.</p>
      </div>
      <div className="join-wrap">
        <form
          onSubmit={(e) => {
            e.preventDefault(); // 폼 제출 시 기본 동작 방지
            joinMember(); // 회원가입 함수 호출
          }}
        >
          {/* 비밀번호 입력 */}
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
                onChange={inputMemberData}
                onBlur={checkPw} // 입력이 끝나면 비밀번호 일치 여부 확인
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
                type="password"
                name="memberPwRe"
                id="memberPwRe"
                value={memberPwRe}
                onChange={inputMemberPwRe}
                onBlur={checkPw} // 입력이 끝나면 비밀번호 일치 여부 확인
              />
            </div>
            <p ref={pwMsgRef}></p>
          </div>

          {/* 닉네임 입력 */}
          <div className="input-wrap">
            <div className="input-title">
              <label htmlFor="memberNickname">닉네임</label>
            </div>
            <div className="input-item">
              <input
                type="text"
                name="memberNickname"
                id="memberNickname"
                value={member.memberNickname}
                onChange={inputMemberData}
                onBlur={checkNickname} // 닉네임이 입력되면 유효성 및 중복 체크
              />
            </div>
            <p
              className={
                nicknameCheck === 0
                  ? ""
                  : nicknameCheck === 1
                  ? "input-ok"
                  : "input-error"
              }
            >
              {nicknameCheck === 0
                ? ""
                : nicknameCheck === 1
                ? "사용가능한 닉네임 입니다."
                : nicknameCheck === 2
                ? "닉네임은 한글, 영어 대/소문자, 숫자 입니다."
                : "이미 사용중인 닉네임 입니다."}
            </p>
          </div>

          {/* 휴대폰 번호 입력 */}
          <div className="input-wrap">
            <div className="input-title">
              <label htmlFor="memberPhone">휴대폰 번호</label>
            </div>
            <div className="input-item">
              <input
                type="text"
                name="memberPhone"
                id="memberPhone"
                value={member.memberPhone}
                onChange={inputMemberData}
                onBlur={checkPhone} // 휴대폰 번호 입력 시 유효성 체크
                maxLength={13} // 010-0000-0000 형식에 맞게 제한
                placeholder="010-0000-0000"
              />
            </div>
            <p
              className={
                phoneError === 0
                  ? ""
                  : phoneError === 1
                  ? "input-ok"
                  : "input-error"
              }
            >
              {phoneError === 0
                ? ""
                : phoneError === 1
                ? ""
                : "휴대폰 번호는 010-0000-0000 형식으로 입력해주세요."}
            </p>
          </div>

          {/* 생년월일 입력 */}
          <div className="input-wrap">
            <div className="input-title">
              <label htmlFor="memberPhone">생년월일</label>
            </div>
            <div>
              <label htmlFor="year">연도:</label>
              <select
                name="year"
                id="year"
                value={year}
                onChange={(e) => setYear(e.target.value)}
              >
                <option value="">연도를 선택하세요</option>
                {years.map((yearOption) => (
                  <option key={yearOption} value={yearOption}>
                    {yearOption}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label htmlFor="month">월:</label>
              <select
                name="month"
                id="month"
                value={month}
                onChange={(e) => setMonth(e.target.value)}
              >
                <option value="">월을 선택하세요</option>
                {months.map((monthOption) => (
                  <option key={monthOption} value={monthOption}>
                    {monthOption}월
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label htmlFor="day">일:</label>
              <select
                name="day"
                id="day"
                value={day}
                onChange={(e) => setDay(e.target.value)}
              >
                <option value="">일을 선택하세요</option>
                {days.map((dayOption) => (
                  <option key={dayOption} value={dayOption}>
                    {dayOption}일
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* 성별 선택 */}
          <div className="input-wrap">
            <div className="input-title">
              <label htmlFor="memberGender">성별</label>
            </div>
            <div>
              <label>성별:</label>
              <div>
                <label>
                  <input
                    type="radio"
                    value="남"
                    name="memberGender"
                    id="memberGender"
                    checked={member.memberGender === "남"}
                    onChange={inputMemberData}
                  />
                  남성
                </label>
                <label>
                  <input
                    type="radio"
                    value="여"
                    name="memberGender"
                    id="memberGender"
                    checked={member.memberGender === "여"}
                    onChange={inputMemberData}
                  />
                  여성
                </label>
              </div>
            </div>
          </div>

          {/* 회원가입 버튼 */}
          <div className="join-button-box">
            <button
              type="submit"
              className={`join-button ${isFormValid ? "" : "disabled"}`}
              style={{ display: isFormValid ? "block" : "none" }} // 버튼 보이기/숨기기
              disabled={!isFormValid}
            >
              회원가입
            </button>
          </div>
        </form>
      </div>
    </section>
  );
};

export default Join2;
