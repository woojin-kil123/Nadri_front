import { useEffect, useRef, useState } from "react";
import { Link } from "react-router-dom";

const Join2 = () => {
  const [member, setMember] = useState({
    memberEmail: "",
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

    if (member.memberPw === memberPwRe) {
      pwMsgRef.current.classList.add("valid");
      pwMsgRef.current.innerText = "비밀번호가 일치합니다.";
    } else {
      pwMsgRef.current.classList.add("invalid");
      pwMsgRef.current.innerText = "비밀번호가 일치하지 않습니다.";
    }
  };
  // 생년월일 처리 함수 수정
  const birth = () => {
    // month와 day가 1자리일 경우 앞에 0을 붙여주는 처리
    const formattedMonth = String(month).padStart(2, "0"); // month를 문자열로 변환 후 padStart 사용
    const formattedDay = String(day).padStart(2, "0"); // day를 문자열로 변환 후 padStart

    const birthString = `${year}${formattedMonth}${formattedDay}`;
    // 생년월일 정보를 바로 memberBirth에 저장
    setMember((prevState) => ({ ...prevState, memberBirth: birthString }));
  };
  const joinMember = () => {
    birth();
    console.log(member);
  };
  // 생년월일 구성
  const [year, setYear] = useState("");
  const [month, setMonth] = useState("");
  const [day, setDay] = useState("");
  const currentYear = new Date().getFullYear();
  const years = Array.from(
    { length: currentYear - 1900 + 1 },
    (_, i) => currentYear - i
  );
  const months = Array.from({ length: 12 }, (_, i) => i + 1);
  const getDaysInMonth = (year, month) => {
    const daysInMonth = new Date(year, month, 0).getDate();
    return Array.from({ length: daysInMonth }, (_, i) => i + 1);
  };
  const [days, setDays] = useState([]);
  useEffect(() => {
    if (year && month) {
      const updatedDays = getDaysInMonth(year, month);
      setDays(updatedDays);
      if (!updatedDays.includes(parseInt(day))) {
        setDay(updatedDays[0] || "");
      }
    }
  }, [year, month, day]);

  // member 상태 업데이트 후 바로 실행되는 effect
  useEffect(() => {
    if (member.memberBirth) {
      // memberBirth가 변경될 때마다 콘솔 로그로 출력
      console.log(member);
    }
  }, [member.memberBirth]); // memberBirth 상태에 의존

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
            birth();
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
                    value="M"
                    name="memberGender"
                    id="memberGender"
                    checked={member.memberGender === "M"}
                    onChange={inputMemberData}
                  />
                  남성
                </label>
                <label>
                  <input
                    type="radio"
                    value="F"
                    name="memberGender"
                    id="memberGender"
                    checked={member.memberGender === "F"}
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
