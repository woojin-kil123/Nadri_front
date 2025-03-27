import Spotlist from "./Spotlist";

const ContentMain = () => {
  return (
    <div className="content-wrap">
      <div className="page-title">여기서 여행컨텐츠 조회</div>
      <div className="page-content">
        <div className="contentlist-side">
          <section className="section menu-box"></section>
        </div>
        <div className="contentlist-content">
          <Spotlist />
        </div>
      </div>
    </div>
  );
};
export default ContentMain;
