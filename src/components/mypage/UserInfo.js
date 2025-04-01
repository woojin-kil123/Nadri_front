import { useRecoilState } from "recoil";
import { loginNicknameState } from "../utils/RecoilData";
import { useEffect, useState } from "react";
import axios from "axios";

const UserInfo = () => {
  const [loginNickname, setLoginNickname] = useRecoilState(loginNicknameState); //리코일에서 로그인한 회원 아이디 조회
  const [member, setMember] = useState(null); // 회원 상세 정보를 저장할 member state

  //회원 정보 가져오기
  useEffect(() => {
    axios
      .get(
        `${process.env.REACT_APP_BACK_SERVER}/member/selectMember${loginNickname}`
      )
      .then((res) => {
        console.log(res);
        setMember(res.data);
      })
      .catch((err) => {
        console.log(err);
      });
  }, []);

  return (
    <div>
      <h2 className="user-info-title">내 정보 관리</h2>

      <table className="user-info-content">
        <tbody>
          <tr>
            <th> 아이디</th>
            <td className="left"></td>
          </tr>
        </tbody>
      </table>

      <div className="button-zone"></div>
    </div>
  );
};

export default UserInfo;
