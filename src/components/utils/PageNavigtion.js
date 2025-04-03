import NavigateBeforeIcon from "@mui/icons-material/NavigateBefore";
import NavigateNextIcon from "@mui/icons-material/NavigateNext";
import LastPageIcon from "@mui/icons-material/LastPage";
import FirstPageIcon from "@mui/icons-material/FirstPage";
const PageNavigation = (props) => {
  const pi = props.pi;
  const reqPage = props.reqPage;
  const setReqPage = props.setReqPage;
  const totalPage = pi.totalPage;
  //paging을하는jsp가 저장될 배열
  const arr = new Array();
  //제일앞으로(1페이지로 이동)
  arr.push(
    <li key="first-page">
      <span
        className="material-icons page-item"
        onClick={() => {
          setReqPage(1);
        }}
      >
        <FirstPageIcon />
      </span>
    </li>
  );
  //이전페이지(현재 요청페이지보다 하나 전 ->reqPage-1)
  arr.push(
    <li key="prev-page">
      <span
        className="material-icons page-item"
        onClick={() => {
          if (reqPage !== 1) {
            setReqPage(reqPage - 1);
          }
        }}
      >
        <NavigateBeforeIcon />
      </span>
    </li>
  );
  //페이지 숮자
  let pageNo = pi.pageNo;
  for (let i = 0; i < pi.pageNaviSize; i++) {
    arr.push(
      <li key={"page-" + i}>
        <span
          onClick={(e) => {
            const pageNumber = e.target.innerText;
            setReqPage(Number(pageNumber));
          }}
          className={pageNo === reqPage ? "page-item active-page" : "page-itme"}
        >
          {pageNo}
        </span>
      </li>
    );
    pageNo++;
    if (pageNo > pi.totalPage) {
      break;
    }
  }
  //다음페이지(현재 요청페이지보다 하나 전 ->reqPage+1)
  arr.push(
    <li key="next-page">
      <span
        className="material-icons page-item"
        onClick={() => {
          if (reqPage !== totalPage) {
            setReqPage(reqPage + 1);
          }
        }}
      >
        <NavigateNextIcon />
      </span>
    </li>
  );
  //마지막페이지(totalPage)
  arr.push(
    <li key="last-page">
      <span
        className="material-icons page-item"
        onClick={() => {
          setReqPage(totalPage);
        }}
      >
        <LastPageIcon />
      </span>
    </li>
  );
  return <ul className="pagination">{arr}</ul>;
};

export default PageNavigation;
