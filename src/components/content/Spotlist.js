import axios from "axios";

const Spotlist = () => {
  const backServer = process.env.REACT_APP_BACK_SERVER;
  let pageNo = 1;
  const selectList = () => {
    axios
      .get(`${backServer}/content/spotPlace`)
      .then((res) => {
        console.log(res);
      })
      .catch((err) => {
        console.log(err);
      });
  };

  return {
    /*<button onClick={selectList}>리스트조회</button>*/
  };
};
export default Spotlist;
