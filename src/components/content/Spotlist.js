import axios from "axios";

const Spotlist = () => {
  const backServer = process.env.REACT_APP_BACK_SERVER;
  let pageNo = 1;
  axios
    .get(`${backServer}/tour/spotPlace`)
    .then((res) => {
      console.log(res);
    })
    .catch((err) => {
      console.log(err);
    });
};
export default Spotlist;
