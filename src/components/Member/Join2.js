import axios from "axios";
import { useEffect, useRef, useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";

const Join2 = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { email } = location.state || {}; // 이메일 데이터를 가져옴 (없으면 기본값으로 {} 설정)
  console.log(email);
  const [member, setMember] = useState({
    memberEmail: "1233@ㅋㅋ",
    memberPw: "",
    memberNickname: "",
    memberPhone: "",
    memberBirth: "",
    memberGender: "",
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

  const [idCheck, setIdCheck] = useState(0);
  const checkNickname = () => {
    //아이디 유효성검사
    //1. 정규표현식
    //2. 정규표현식 만족하면 -> 중복체크
    const idReg = /^[a-zA-Z0-9가-힣]+$/;
    if (idReg.test(member.memberNickname)) {
      //중복체크진행
      axios
        .get(
          `${process.env.REACT_APP_BACK_SERVER}/member/exists?memberNickname=${member.memberNickname}`
        )
        .then((res) => {
          console.log(res);
          if (res.data === 0) {
            setIdCheck(1);
          } else {
            setIdCheck(3);
          }
        })
        .catch((err) => {
          console.log(err);
        });
    } else {
      setIdCheck(2);
    }
  };

  const [phoneError, setPhoneError] = useState(0);
  const checkPhone = () => {
    const phoneRegex = /^(010-\d{4}-\d{4})$/;
    const formattedPhone = member.memberPhone.replace(/[^0-9]/g, "");
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
      setPhoneError(2);
    } else {
      setPhoneError(1); // 유효한 형식일 경우 에러 메시지 제거
    }
  };

  const joinMember = () => {
    if (!member.memberBirth) {
      alert("생년월일을 선택하세요.");
      return;
    }

    console.log(member);
    axios
      .post(`${process.env.REACT_APP_BACK_SERVER}/member/join`, member)
      .then((res) => {
        console.log(res);
        navigate("/");
      })
      .catch((err) => {
        console.log(err);
      });
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
  useEffect(() => {
    if (year !== "" && month !== "" && day !== "") {
      const formattedMonth = String(month).padStart(2, "0");
      const formattedDay = String(day).padStart(2, "0");
      const birthString = `${year}${formattedMonth}${formattedDay}`;

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
                onBlur={checkNickname}
              ></input>
            </div>
            <p
              className={
                idCheck === 0
                  ? "input-msg"
                  : idCheck === 1
                  ? "input-msg valid"
                  : "input-msg invalid"
              }
            >
              {idCheck === 0
                ? ""
                : idCheck === 1
                ? "사용가능한 닉네임 입니다."
                : idCheck === 2
                ? "닉네임은 한글, 영어 대/소문자, 숫자 입니다."
                : "이미 사용중인 닉네임 입니다."}
            </p>
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
                onBlur={checkPhone}
                maxLength={13} // 010-0000-0000 형식에 맞게 제한
                placeholder="010-0000-0000"
              ></input>
            </div>
            <p
              className={
                phoneError === 0
                  ? "input-msg"
                  : phoneError === 1
                  ? "input-msg valid"
                  : "input-msg invalid"
              }
            >
              {phoneError === 0
                ? " "
                : phoneError === 1
                ? " "
                : "휴대폰 번호는 010-0000-0000 형식으로 입력해주세요."}
            </p>
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
