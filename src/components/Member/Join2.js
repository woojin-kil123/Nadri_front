import { useEffect, useRef, useState } from "react";
import { Link } from "react-router-dom";

const Join2 = () => {
  const [member, setMember] = useState({
    memberNickname: "",
    memberPw: "",
    memberNickname: "",
    memberPhone: "",
    memberBirth: "",
    memberGender: "",
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

  // 상태 선언
  const [year, setYear] = useState("");
  const [month, setMonth] = useState("");
  const [day, setDay] = useState("");

  // 연도 목록 생성
  const currentYear = new Date().getFullYear();
  const years = Array.from(
    { length: currentYear - 1900 + 1 },
    (_, i) => currentYear - i
  );

  // 월 목록
  const months = Array.from({ length: 12 }, (_, i) => i + 1);

  // 일 목록 업데이트 함수
  const getDaysInMonth = (year, month) => {
    const daysInMonth = new Date(year, month, 0).getDate();
    return Array.from({ length: daysInMonth }, (_, i) => i + 1);
  };

  // 월 또는 연도가 변경될 때마다 일 목록 업데이트
  const [days, setDays] = useState([]);

  useEffect(() => {
    // 연도와 월이 모두 선택되었을 때만 일 목록 업데이트
    if (year && month) {
      const updatedDays = getDaysInMonth(year, month);
      setDays(updatedDays);

      // 선택된 날짜가 일 목록에 없으면 첫 번째 날짜로 설정
      if (!updatedDays.includes(parseInt(day))) {
        setDay(updatedDays[0] || "");
      }
    }
  }, [year, month, day]);

  const handleSubmit = (e) => {
    e.preventDefault();
    alert(`선택된 생년월일: ${year}-${month}-${day}`);
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
              <label htmlFor="memberPhone">휴대폰 번호</label>
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

          <div className="input-wrap">
            <div className="input-title">
              <label htmlFor="memberPhone">생년월일</label>
            </div>
            <div>
              <label htmlFor="year">연도:</label>
              <select
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

          <div className="input-wrap">
            <div className="input-title">
              <label htmlFor="memberGender">성별</label>
            </div>
            {/* 성별 입력 (Radio Buttons) */}
            <div>
              <label>성별:</label>
              <div>
                <label>
                  <input
                    type="radio"
                    value="male"
                    name="memberGender"
                    id="memberGender"
                    checked={member.memberGender === "male"}
                    onChange={inputMemberData}
                  />
                  남성
                </label>
                <label>
                  <input
                    type="radio"
                    value="female"
                    name="memberGender"
                    id="memberGender"
                    checked={member.memberGender === "female"}
                    onChange={inputMemberData}
                  />
                  여성
                </label>
              </div>
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
