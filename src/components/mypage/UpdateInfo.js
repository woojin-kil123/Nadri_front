import { useNavigate } from "react-router-dom";
import { loginNicknameState } from "../utils/RecoilData";
import { useRecoilState } from "recoil";
import { useEffect, useState, useSyncExternalStore } from "react";
import axios from "axios";
import Swal from "sweetalert2";

const UpdateInfo = () => {
  const navigate = useNavigate();
  const [loginNickname, setLoginNickname] = useRecoilState(loginNicknameState); //리코일에서 로그인한 회원 닉네임 조회
  const [member, setMember] = useState(null); // 회원 상세 정보를 저장할 member state
  const [isFormValid, setIsFormValid] = useState(true); // 폼 유효성 상태

  // 상태 관리: 프로필 이미지 URL
  const [profileImg, setProfileImg] = useState();

  // 기본 프로필 이미지 경로
  const defaultProfileImg = "/image/profile_default_image.png";

  //회원 정보 가져오기
  useEffect(() => {
    axios
      .get(
        `${process.env.REACT_APP_BACK_SERVER}/member/memberInfo?memberNickname=${loginNickname}`
      )
      .then((res) => {
        console.log(res);
        setMember(res.data);
        // 서버에서 프로필 이미지가 있다면 그 이미지로 설정
        setProfileImg(
          res.data.profileImg
            ? `${process.env.REACT_APP_BACK_SERVER}/profile/${res.data.profileImg}`
            : defaultProfileImg
        );
        // 생년월일 분리하여 설정
        if (res.data.memberBirth) {
          const birthYear = res.data.memberBirth.slice(0, 4);
          const birthMonth = res.data.memberBirth.slice(4, 6);
          const birthDay = res.data.memberBirth.slice(6, 8);
          setYear(birthYear);
          setMonth(birthMonth);
          setDay(birthDay);
        }
      })
      .catch((err) => {
        console.log(err);
      });
  }, [loginNickname]);

  // 회원 정보 입력 필드 업데이트 핸들러
  const inputMemberData = (e) => {
    const name = e.target.name; // 입력 필드의 name 속성
    const inputData = e.target.value; // 입력 필드의 값
    setMember({ ...member, [name]: inputData }); // 해당 필드의 값 상태 업데이트
  };

  // 닉네임 중복 체크 및 유효성 검사
  const [nicknameCheck, setNicknameCheck] = useState(0);
  const checkNickname = () => {
    const idReg = /^[a-zA-Z0-9가-힣]+$/; // 닉네임에 사용할 수 있는 문자: 한글, 영어 대소문자, 숫자
    if (idReg.test(member.memberNickname)) {
      if (member.memberNickname === loginNickname) {
        setNicknameCheck(2); // 동일한 닉네임
      } else if (member.memberNickname !== loginNickname) {
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
              setNicknameCheck(4); // 이미 사용중인 닉네임
            }
          })
          .catch((err) => {
            console.log(err); // 에러 발생 시 콘솔 출력
          });
      } else {
        setNicknameCheck(3); // 유효하지 않은 닉네임
      }
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

  const handleImageChange = (event) => {
    const file = event.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setProfileImg(URL.createObjectURL(file)); // 선택한 이미지 미리보기 설정
        updateMemberProfileImg(file); // 프로필 이미지 상태 업데이트
      };
      reader.readAsDataURL(file); // 파일을 읽어 URL 형식으로 변환
    } else {
      updateMemberProfileImg(null); // 이미지를 수정하지 않으면 null로 설정
    }
  };

  // member.profileImg 업데이트
  const updateMemberProfileImg = (file) => {
    setMember((prevState) => ({
      ...prevState,
      profileImg: file, // 프로필 이미지만 업데이트
    }));
  };

  // 기본 이미지로 설정
  const handleSetDefaultImage = () => {
    setProfileImg(defaultProfileImg); // 기본 이미지로 변경
    setMember((prevState) => ({
      ...prevState,
      profileImg: null, // 서버로 보낼 이미지도 null로 설정
    }));
  };

  // 폼 유효성 검사 호출
  useEffect(() => {
    validateForm();
  }, [member, nicknameCheck, phoneError]);

  // 유효성 검사
  const validateForm = () => {
    const isNicknameValid =
      member?.memberNickname &&
      member.memberNickname.trim() !== "" &&
      nicknameCheck !== 4;
    const isPhoneValid =
      member?.memberPhone &&
      /^[0-9]{3}-[0-9]{4}-[0-9]{4}$/.test(member.memberPhone);
    const isGenderValid = member?.memberGender !== "";

    // 모든 필드가 유효하면 isFormValid를 true로 설정
    setIsFormValid(isNicknameValid && isPhoneValid && isGenderValid);
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

  const UpdateInfo = () => {
    const form = new FormData();
    form.append("memberEmail", member.memberEmail);
    form.append("memberNickname", member.memberNickname);
    form.append("memberPhone", member.memberPhone);
    form.append("memberBirth", member.memberBirth);
    form.append("memberGender", member.memberGender);
    if (member.profileImg) {
      form.append("uploadProfile", member.profileImg); // 실제 이미지 파일 객체를 추가
    }
    console.log(member.memberEmail);
    console.log(member.memberNickname);
    console.log(member.memberPhone);
    console.log(member.memberGender);
    console.log(member.memberBirth);
    console.log(member.profileImg);
    console.log(form);
    axios
      .patch(`${process.env.REACT_APP_BACK_SERVER}/member`, form, {
        headers: {
          contentType: "multipart/form-data",
          processData: false,
        },
      })
      .then((res) => {
        console.log(res);
        Swal.fire({
          title: "정보 수정 완료!",
          text: "회원 정보가 성공적으로 수정되었습니다.",
          icon: "success",
          confirmButtonText: "확인",
          confirmButtonColor: "var(--main2)",
        }).then(() => {
          // 알림을 확인 버튼을 누른 후 mypage/userInfo로 이동
          navigate("/mypage/userInfo");
        });
      })
      .catch((err) => {
        console.log(err);
        Swal.fire({
          title: "오류 발생",
          text: "정보 수정 중 오류가 발생했습니다. 다시 시도해주세요.",
          icon: "error",
          confirmButtonText: "확인",
          confirmButtonColor: "var(--main2)",
        });
      });
  };
  console.log("test", year, month, day, days);
  return (
    <div>
      <h1 className="mypage-menu-title">회원 정보 수정</h1>
      {member && (
        <>
          <div className="user-profile">
            <div className="user-profile-upload">
              {/* 이미지 클릭 시 file input을 트리거 */}
              <img
                src={profileImg} // 프로필 이미지 출력
                alt="Profile"
                onClick={() => document.getElementById("file-input").click()} // 클릭하면 파일 선택 창 열기
              />
              {/* 숨겨진 파일 input */}
              <input
                id="file-input"
                type="file"
                style={{ display: "none" }} // input 숨기기
                accept="image/*" // 이미지 파일만 선택하도록 제한
                onChange={handleImageChange} // 이미지 선택 시 처리
              />
            </div>
            <div className="user-upload-profile-title">
              <div>
                프로필 사진 등록
                <button
                  className="default-image"
                  onClick={handleSetDefaultImage}
                >
                  기본 프로필
                </button>
              </div>
            </div>
          </div>
          <div className="user-info-content">
            <div className="join-wrap">
              <form
                onSubmit={(e) => {
                  e.preventDefault(); // 폼 제출 시 기본 동작 방지
                  UpdateInfo();
                }}
              >
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
                      disabled
                      style={{ color: "rgb(160, 160, 160)" }}
                    />
                  </div>
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
                      placeholder="자신을 표현할 수 있는 이름을 지어주세요."
                      style={{ color: "rgb(160, 160, 160)" }}
                    />
                  </div>
                  <p
                    className={
                      nicknameCheck === 0
                        ? ""
                        : nicknameCheck === 1
                        ? "input-ok"
                        : nicknameCheck === 2
                        ? "input-ok"
                        : "input-error"
                    }
                  >
                    {nicknameCheck === 0
                      ? ""
                      : nicknameCheck === 1
                      ? "사용가능한 닉네임 입니다."
                      : nicknameCheck === 2
                      ? "동일한 닉네임 입니다."
                      : nicknameCheck === 3
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
                    <label htmlFor="memberBirth">생년월일</label>
                  </div>
                  <div className="select-wrap">
                    <div className="year">
                      <select
                        name="year"
                        id="year"
                        value={year}
                        onChange={(e) => setYear(e.target.value)}
                      >
                        <option value="">년도</option>
                        {years.map((yearOption) => (
                          <option
                            key={yearOption}
                            value={yearOption}
                            selected={yearOption === year}
                          >
                            {yearOption}
                          </option>
                        ))}
                      </select>
                    </div>
                    <div className="month">
                      <select
                        name="month"
                        id="month"
                        value={Number(month)}
                        onChange={(e) => setMonth(e.target.value)}
                      >
                        <option value="">월</option>
                        {months.map((monthOption) => {
                          return (
                            <option key={monthOption} value={monthOption}>
                              {monthOption}월
                            </option>
                          );
                        })}
                      </select>
                    </div>
                    <div className="day">
                      <select
                        name="day"
                        id="day"
                        value={Number(day)}
                        onChange={(e) => setDay(e.target.value)}
                      >
                        <option value="">일</option>
                        {days.map((dayOption) => {
                          return (
                            <option key={dayOption} value={dayOption}>
                              {dayOption}일
                            </option>
                          );
                        })}
                      </select>
                    </div>
                  </div>
                </div>

                {/* 성별 선택 */}
                <div className="input-wrap">
                  <div className="input-title">
                    <label htmlFor="memberGender">성별</label>
                  </div>
                  <div>
                    <div>
                      <label className="memberGender">
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
                      <label className="memberGender">
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

                {/* 정보수정 버튼 */}
                <div className="join-button-box2">
                  <button
                    type="submit"
                    className={`join-button ${isFormValid ? "" : "disabled"}`}
                    disabled={!isFormValid}
                    style={{
                      pointerEvents: !isFormValid ? "none" : "auto", // 버튼 비활성화 시 클릭 불가
                      backgroundColor: isFormValid ? "#30c272" : "white", // 비활성화 시 배경색 흰색으로
                      color: isFormValid ? "white" : "#d3d3d3", // 비활성화 시 글자색 여린 회색으로
                    }}
                    onMouseEnter={(e) => {
                      if (isFormValid) {
                        e.target.style.backgroundColor = "#166139"; // hover 시 배경색 변경
                      }
                    }}
                    onMouseLeave={(e) => {
                      if (isFormValid) {
                        e.target.style.backgroundColor = "#30c272"; // hover 끝난 후 원래 배경색으로 복구
                      }
                    }}
                  >
                    정보수정
                  </button>
                </div>
              </form>
            </div>
          </div>
        </>
      )}
    </div>
  );
};

export default UpdateInfo;
