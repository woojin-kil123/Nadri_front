import { useState } from "react";
import { useRecoilState } from "recoil";

const PlannerWrite = () => {
  //마커 오버레이 여닫음
  const [openOverlay, setOpenOverlay] = useState(null);
  //플래너 창 여닫음
  const [openPlanner, setOpenPlanner] = useState(false);
  //"플래너에 추가하기" 창 여닫음
  const [openPlanningModal, setOpenPlanningModal] = useState(null);
  //플래너에 추가한 장소 리스트
  const [plannedPlaceList, setPlannedPlaceList] = useState([]);
  //플래너 제목
  const [planName, setPlanName] = useState("");
  //플래너 저장 창 여닫음
  const [openSaveModal, setOpenSaveModal] = useState(false);
  //장소 리스트(임시 데이터)
  const [placeList, setPlaceList] = useState([]);
  //정렬 옵션(1:거리순, 2:리뷰많은순, 3:이름순)
  const [sortOption, setSortOption] = useState(1);
  //필터 옵션(null:전체, 1:숙박시설, 2:음식점, 3:그외)
  const [filterOption, setFilterOption] = useState(null);
  //유저닉네임
  const [loginNickname, setLoginNickname] = useRecoilState(loginNicknameState);
  //플래너 소유자(작성자) 여부
  const [isOwner, setIsOwner] = useState(true);

  //↓ 맵 관련 STATE
  //현재 보이는 지도 화면
  const [mapBounds, setMapBounds] = useState(null);
  //지도 중심좌표(화면 이동 시 사용)
  const [mapCenter, setMapCenter] = useState({
    lat: 37.5341338,
    lng: 126.897333254,
  });
  //유저가 클릭한 지도 위치
  const [userMarker, setUserMarker] = useState(null);
  //유저 클릭 위치를 중심으로 하는 반경 범위
  const [userRadius, setUserRadius] = useState(1000);

  //↓ 플래너 상태 판별용 STATE
  //주소에서 받은 planNo
  const { planNo } = useParams();
  //플래너 모드: view, write, null
  const [plannerMode, setPlannerMode] = useState(null);

  return (
    <>
      <div></div>
    </>
  );
};

export default PlannerWrite;
