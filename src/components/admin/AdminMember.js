import { Box, Tab, Tabs } from "@mui/material";
import axios from "axios";
import { useEffect, useState } from "react";
import Swal from "sweetalert2";

const AdminMember = () => {
  const backServer = process.env.REACT_APP_BACK_SERVER;
  const [members, setMembers] = useState([]);
  const [tab, setTab] = useState(1);

  useEffect(() => {
    loadMembers(0); // 탭1: 경고 회원 목록 (status=0)
  }, []);

  const handleTabChange = (_, newValue) => {
    setTab(newValue);
    if (newValue === 1) loadMembers(0); // 경고 회원
    else if (newValue === 2) loadMembers(1); // 강퇴 통보 완료
    else if (newValue === 3) loadMembers(2); // 강퇴 확인
  };

  const loadMembers = (status) => {
    axios
      .get(`${backServer}/admin/member/list`, { params: { status } })
      .then((res) => {
        setMembers(res.data);
      })
      .catch((err) => console.log(err));
  };

  const handleKick = (memberNo) => {
    Swal.fire({
      icon: "warning",
      title: "회원 강퇴",
      text: "해당 회원을 강퇴시키겠습니까?",
      showConfirmButton: true,
      confirmButtonText: "확인",
      showCancelButton: true,
      cancelButtonText: "취소",
    }).then((result) => {
      if (result.isConfirmed) {
        axios
          .patch(`${backServer}/admin/member/${memberNo}`)
          .then(() => {
            setMembers((prev) =>
              prev.filter((m) => parseInt(m.memberNo) !== parseInt(memberNo))
            );
          })
          .catch((err) => console.log(err));
      }
    });
  };

  const handleConfirmDelete = (memberNo) => {
    Swal.fire({
      title: "확인 완료 처리",
      text: "이 회원을 확인 처리하시겠습니까?",
      icon: "info",
      showCancelButton: true,
      confirmButtonText: "확인",
      cancelButtonText: "취소",
    }).then((result) => {
      if (result.isConfirmed) {
        setMembers((prev) => prev.filter((m) => m.memberNo !== memberNo));
      }
    });
  };

  return (
    <div className="member-tbl-wrap">
      <div className="warning-member-title">
        <h2>경고회원 관리</h2>
      </div>
      <Box>
        <Tabs value={tab} onChange={handleTabChange}>
          <Tab value={1} label="경고 회원 목록" />
          <Tab value={2} label="강퇴 통보 완료" />
          <Tab value={3} label="강퇴 확인" />
        </Tabs>

        <table className="admin-table member-tbl tbl">
          <thead>
            <tr>
              <th>번호</th>
              <th>닉네임</th>
              <th>전화번호</th>
              <th>이메일</th>
              <th>생년월일</th>
              <th>경고</th>
              <th>관리</th>
            </tr>
          </thead>
          <tbody>
            {members.map((m) => (
              <tr key={m.memberNo}>
                <td>{m.memberNo}</td>
                <td>{m.memberNickname}</td>
                <td>{m.memberPhone}</td>
                <td>{m.memberEmail}</td>
                <td>{m.memberBirth}</td>
                <td>{m.warningStack}</td>
                <td>
                  {tab === 1 && (
                    <button onClick={() => handleKick(m.memberNo)}>강퇴</button>
                  )}
                  {tab === 2 && <span style={{ color: "#999" }}>처리중</span>}
                  {tab === 3 && (
                    <button onClick={() => handleConfirmDelete(m.memberNo)}>
                      확인
                    </button>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </Box>
    </div>
  );
};

export default AdminMember;
