import axios from "axios";
import { useEffect, useState } from "react";
import Swal from "sweetalert2";

const AdminMember = () => {
  const backServer = process.env.REACT_APP_BACK_SERVER;
  const [members, setMembers] = useState([]);
  useEffect(() => {
    axios
      .get(`${backServer}/admin/member/list`)
      .then((res) => {
        console.log(res);
        setMembers(res.data);
      })
      .catch((err) => {
        console.log(err);
      });
  }, []);

  const handleLevelChange = (memberNo, newLevel) => {
    axios
      .patch(`${backServer}/admin/member/level`, {
        memberNo: memberNo,
        memberLevel: parseInt(newLevel),
      })
      .then(() => {
        setMembers((prev) =>
          prev.map((m) =>
            m.memberNo === memberNo ? { ...m, memberLevel: newLevel } : m
          )
        );
      });
  };
  const handleKick = (memberNo) => {
    console.log("강퇴 전:", members);
    console.log("강퇴할 번호:", memberNo);
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
            setMembers((prev) => {
              const filtered = prev.filter(
                (m) => parseInt(m.memberNo) !== parseInt(memberNo)
              );
              console.log("강퇴 후:", filtered);
              return filtered;
            });
          })
          .catch((err) => {
            console.log(err);
          });
      }
    });
  };

  return (
    <div className="member-tbl-wrap">
      <h2>경고회원 관리</h2>
      <table className="admin-table member-tbl tbl">
        <thead>
          <tr>
            <th style={{ width: "7%" }}>번호</th>
            <th style={{ width: "13%" }}>닉네임</th>
            <th style={{ width: "15%" }}>전화번호</th>
            <th style={{ width: "20%" }}>이메일</th>
            <th style={{ width: "15%" }}>생년월일</th>
            <th style={{ width: "7%" }}>경고</th>
            <th style={{ width: "13%" }}>레벨</th>
            <th style={{ width: "12%" }}>관리</th>
          </tr>
        </thead>
        <tbody>
          {members.map((m, i) => (
            <tr key={m.memberNo}>
              <td>{m.memberNo}</td>
              <td>{m.memberNickname}</td>
              <td>{m.memberPhone}</td>
              <td>{m.memberEmail}</td>
              <td>{m.memberBirth}</td>
              <td>{m.warningStack}</td>
              <td>
                <select
                  value={m.memberLevel}
                  onChange={(e) =>
                    handleLevelChange(m.memberNo, e.target.value)
                  }
                >
                  <option value={1}>일반</option>
                  <option value={2}>관리자</option>
                </select>
              </td>
              <td>
                <button onClick={() => handleKick(m.memberNo)}>강퇴</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default AdminMember;
