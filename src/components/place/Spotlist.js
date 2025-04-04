// import axios from "axios";

// const Spotlist = (props) => {
//   const contentTypeId = props.contentTypeId;
//   const backServer = process.env.REACT_APP_BACK_SERVER;
//   let pageNo = 1;
//   const selectList = () => {
//     axios
//       .get(`${backServer}/content/spot/${contentTypeId}`)
//       .then((res) => {
//         console.log(res);
//       })
//       .catch((err) => {
//         console.log(err);
//       });
//   };

//   return (
//     /*<button onClick={selectList}>리스트조회</button>*/
//     <section className="section spot-list">
//       <div className="page-title">관광지 조회</div>
//       <div className="spot-list-wrap">
//         <ul className="spot-wrap">
//           {/* {tourList.map((tour, index) => {
//             return <TourItem key={"tour-" + index} tour={tour}></TourItem>;
//           })} */}
//         </ul>
//       </div>
//     </section>
//   );
// };

// const TourItem = (props) => {
//   const tour = props.tour;
//   console.log(tour);
//   return (
//     <li className="spot-list-item">
//       <div className="spot-item-img"></div>
//     </li>
//   );
// };
// export default Spotlist;
