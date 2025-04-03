import { useRecoilState } from "recoil";
import { loginNicknameState } from "../utils/RecoilData";
import { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import "./mypage.css";
import Swal from "sweetalert2";

const UserInfo = () => {
  const navigate = useNavigate();
  const [loginNickname, setLoginNickname] = useRecoilState(loginNicknameState); //리코일에서 로그인한 회원 닉네임 조회
  const [member, setMember] = useState(null); // 회원 상세 정보를 저장할 member state

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

  const formatBirthDate = (birthDate) => {
    const year = birthDate.substring(0, 4); // 연도 추출
    const month = birthDate.substring(4, 6); // 월 추출
    const day = birthDate.substring(6, 8); // 일 추출
    return `${year}년 ${month}월 ${day}일`; // 원하는 형식으로 반환
  };

  const deleteUser = () => {
    Swal.fire({
      title: "회원 탈퇴",
      icon: "warning",
      text: "회원을 탈퇴하시겠습니까?",
      showCancelButton: true,
      confirmButtonText: "탈퇴하기",
      cancelButtonText: "취소",
      confirmButtonColor: "var(--main2)",
    }).then((res) => {
      if (res.isConfirmed) {
        axios
          .delete(
            `${process.env.REACT_APP_BACK_SERVER}/member/${loginNickname}`
          )
          .then((res) => {
            if (res.data === 1) {
              Swal.fire({
                title: "회원 탈퇴 완료",
                icon: "info",
              }).then(() => {
                setLoginNickname("");
                delete axios.defaults.headers.common["Authorization"];
                window.localStorage.removeItem("refreshToken");
                navigate("/");
              });
            }
          })
          .catch((err) => {
            console.log(err);
          });
      }
    });
  };

  return (
    <div>
      <h1 className="mypage-menu-title">내 정보 관리</h1>
      {member && (
        <>
          <div className="user-profile">
            <div className="user-profile-photo">
              {" "}
              <img
                src={
                  member.profileImg
                    ? `${process.env.REACT_APP_BACK_SERVER}/profile/${member.profileImg}`
                    : "/image/profile_default_image.png"
                }
              />
            </div>
            <div className="user-profile-title">
              <div className="user-profile-email">{member.memberEmail}</div>
              <div className="user-profile-nickname">
                {member.memberNickname}
              </div>
            </div>
          </div>
          <div className="user-info-content">
            <h2 className="user-info-title">회원 정보</h2>
            <div className="info-wrap">
              <div className="info-title">
                <label htmlFor="memberPw">이메일</label>
              </div>
              <div className="info-item">
                <input
                  className="left"
                  value={member.memberEmail}
                  disabled
                ></input>
              </div>
            </div>
            <div className="info-wrap">
              <div className="info-title">
                <label htmlFor="memberPw">닉네임</label>
              </div>
              <div className="info-item">
                <input
                  className="left"
                  value={member.memberNickname}
                  disabled
                ></input>
              </div>
            </div>
            <div className="info-wrap">
              <div className="info-title">
                <label htmlFor="memberPw">휴대폰번호</label>
              </div>
              <div className="info-item">
                <input
                  className="left"
                  value={member.memberPhone}
                  disabled
                ></input>
              </div>
            </div>
            <div className="info-wrap">
              <div className="info-title">
                <label htmlFor="memberPw">생년월일</label>
              </div>
              <div className="info-item">
                <input
                  className="left"
                  value={formatBirthDate(member.memberBirth)}
                  disabled
                ></input>
              </div>
            </div>
            <div className="info-wrap">
              <div className="info-title">
                <label htmlFor="memberPw">성별</label>
              </div>
              <div className="info-item">
                <input
                  className="left"
                  value={
                    member.memberGender === "여"
                      ? "여자"
                      : member.memberGender === "남"
                      ? "남자"
                      : member.memberGender
                  }
                  disabled
                ></input>
              </div>
            </div>
          </div>
          <div className="info-wrap">
            <div className="info-title">
              <label htmlFor="memberLevel">회원레벨</label>
            </div>
            <div className="info-item">
              <input
                className="left"
                value={
                  member.memberLevel === 1
                    ? "일반회원"
                    : member.memberLevel === 2
                    ? "관리자"
                    : ""
                }
                disabled
              ></input>
            </div>
          </div>
          <div className="info-button-zone">
            <form
              onSubmit={(e) => {
                e.preventDefault(); // 폼 제출 시 기본 동작 방지
                navigate("/mypage/updateInfo");
              }}
            >
              <button type="submit" className="join-button">
                정보수정
              </button>
            </form>
          </div>
          <div className="info-item2">
            <input disabled></input>
          </div>

          <form
            onSubmit={(e) => {
              e.preventDefault(); // 폼 제출 시 기본 동작 방지
              deleteUser();
            }}
          >
            <div className="delete-user-title">
              더 이상 나드리 이용을 원하지 않으신가요?
              <button type="submit">회원탈퇴</button>
            </div>
          </form>
        </>
      )}
    </div>
  );
};

export default UserInfo;
