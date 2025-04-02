import { useNavigate } from "react-router-dom";
import { loginNicknameState } from "../utils/RecoilData";
import { useRecoilState } from "recoil";
import { useEffect, useState, useSyncExternalStore } from "react";
import axios from "axios";

const UpdateInfo = () => {
  const navigate = useNavigate();
  const [loginNickname, setLoginNickname] = useRecoilState(loginNicknameState); //리코일에서 로그인한 회원 닉네임 조회
  const [member, setMember] = useState(null); // 회원 상세 정보를 저장할 member state
  const [isFormValid, setIsFormValid] = useState(true); // 폼 유효성 상태

  //회원 정보 가져오기
  useEffect(() => {
    axios
      .get(
        `${process.env.REACT_APP_BACK_SERVER}/member/memberInfo?memberNickname=${loginNickname}`
      )
      .then((res) => {
        console.log(res);
        setMember(res.data);
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

  // 상태 관리: 프로필 이미지 URL
  const [profileImg, setProfileImg] = useState();

  // 이미지 선택 후 미리보기 처리 함수
  const handleImageChange = (event) => {
    const file = event.target.files[0]; // 선택한 파일
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setProfileImg(URL.createObjectURL(file)); // 미리보기 이미지로 설정
        updateMemberProfileImg(file); // member.profileImg 업데이트
      };
      reader.readAsDataURL(file); // 파일을 읽어 URL 형식으로 변환
    } else {
      setProfileImg("/image/profile_default_image.png");
    }
  };

  // member.profileImg 업데이트하는 함수
  const updateMemberProfileImg = (file) => {
    console.log(file);
    setMember((prevState) => ({
      ...prevState, // 이전 상태를 복사
      profileImg: file, // profileImg만 업데이트
    }));
  };
  console.log(member);
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

  const UpdateInfo = () => {
    const form = new FormData();
    form.append("memberEmail", member.memberEmail);
    form.append("memberNickname", member.memberNickname);
    form.append("memberPhone", member.memberPhone);
    form.append("memberGender", member.memberGender);
    if (member.profileImg) {
      form.append("uploadProfile", member.profileImg); // 실제 이미지 파일 객체를 추가
    }
    console.log(member.memberEmail);
    console.log(member.memberNickname);
    console.log(member.memberPhone);
    console.log(member.memberGender);
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
      })
      .catch((err) => {
        console.log(err);
      });
  };
  return (
    <div>
      <h1 className="mypage-menu-title">회원 정보 수정</h1>
      {member && (
        <>
          <div className="user-profile">
            <div className="user-profile-upload">
              {/* 이미지 클릭 시 file input을 트리거 */}
              <img
                src={
                  member.profileImg
                    ? `${process.env.REACT_APP_BACK_SERVER}/profile/${member.profileImg}` // 서버에서 이미지를 가져올 때 `profileImg`를 활용
                    : "/image/profile_default_image.png" // 기본 이미지 경로
                }
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
            <div className="user-profile-title">
              <div>프로필 사진 등록</div>
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
