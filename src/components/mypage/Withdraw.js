import { useState } from "react";

const Withdraw = () => {
  const [reasons, setReasons] = useState({
    reason1: false,
    reason2: false,
    reason3: false,
    reason4: false,
  });

  const handleChange = (e) => {
    const { name, checked } = e.target;
    setReasons({
      ...reasons,
      [name]: checked,
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    // 체크된 이유들을 배열로 수집
    const selectedReasons = Object.keys(reasons)
      .filter((key) => reasons[key])
      .map((key) => key);

    // 탈퇴 사유 출력 또는 서버로 전송
    console.log("Selected reasons:", selectedReasons);

    // 예를 들어, 탈퇴 요청을 서버로 보낼 때:
    // axios.post('/api/deactivate', { reasons: selectedReasons })
    //   .then(response => console.log(response))
    //   .catch(error => console.error(error));

    // 이후 탈퇴 처리
  };

  return (
    <div className="deactivate-account">
      <h2>계정 탈퇴 사유</h2>
      <form onSubmit={handleSubmit}>
        <div>
          <input
            type="checkbox"
            id="reason1"
            name="reason1"
            checked={reasons.reason1}
            onChange={handleChange}
          />
          <label htmlFor="reason1">서비스에 만족하지 못해서</label>
        </div>
        <div>
          <input
            type="checkbox"
            id="reason2"
            name="reason2"
            checked={reasons.reason2}
            onChange={handleChange}
          />
          <label htmlFor="reason2">다른 서비스를 이용하고 있어서</label>
        </div>
        <div>
          <input
            type="checkbox"
            id="reason3"
            name="reason3"
            checked={reasons.reason3}
            onChange={handleChange}
          />
          <label htmlFor="reason3">개인적인 이유로</label>
        </div>
        <div>
          <input
            type="checkbox"
            id="reason4"
            name="reason4"
            checked={reasons.reason4}
            onChange={handleChange}
          />
          <label htmlFor="reason4">기타</label>
        </div>

        <button type="submit">탈퇴 신청</button>
      </form>
    </div>
  );
};

export default Withdraw;
