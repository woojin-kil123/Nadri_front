import axios from "axios";
import { useEffect, useRef, useState } from "react";
import { useRecoilState, useRecoilValue } from "recoil";
import { companyInfoState, placeTypeState } from "../utils/RecoilData";
import DriveFileRenameOutlineIcon from "@mui/icons-material/DriveFileRenameOutline";
import { IconButton } from "@mui/material";
import {
  PieChart,
  Pie,
  Cell,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";

const AdminMain = () => {
  const COLORS = ["#0088FE", "#00C49F", "#FFBB28", "#FF8042"];
  const placeType = useRecoilValue(placeTypeState);
  const [reviewStat, setReviewStat] = useState(null);
  const [planStat, setPlanStat] = useState(null);
  const [company, setCompany] = useRecoilState(companyInfoState);
  const [editMode, setEditMode] = useState(false);
  const [isUpdate, setIsUpdate] = useState(false);
  const [pieChartData, setPieChartData] = useState([]);

  useEffect(() => {
    axios
      .get(`${process.env.REACT_APP_BACK_SERVER}/review/stats`)
      .then((res) => {
        setReviewStat(res.data);
        // PieChart에 맞는 데이터 구조로 변환 후 상태에 저장
        const pieData = res.data.map((item) => ({
          name: `${
            placeType.find((type, _) => item.placeTypeId === type.id)?.name
          }`,
          value: item.reviewCount,
        }));
        setPieChartData(pieData); // 이게 핵심!!
      });
  }, []);
  useEffect(() => {
    axios.get(`${process.env.REACT_APP_BACK_SERVER}/plan/stats`).then((res) => {
      setPlanStat(res.data);
    });
  }, []);
  useEffect(() => {
    axios
      .get(`${process.env.REACT_APP_BACK_SERVER}/admin/company`)
      .then((res) => {
        setCompany(res.data);
      });
  }, [isUpdate]);
  const handleChange = (e) => {
    const { name, value } = e.target;
    setCompany((prev) => ({ ...prev, [name]: value }));
  };
  const updateCompany = () => {
    axios
      .patch(`${process.env.REACT_APP_BACK_SERVER}/admin/company`, company)
      .then((res) => {
        console.log(res.data);
        if (res.data > 0) {
          setIsUpdate((prev) => !prev);
          setEditMode(false);
        }
      });
  };
  return (
    <>
      <div className="total">
        <h2>운영 통계</h2>
        <div className="stats">
          <div className="total-title">
            <h3>리뷰</h3>
          </div>
          <div className="total-content">
            <div className="chart" style={{ width: "50%", height: "300px" }}>
              <ResponsiveContainer>
                <PieChart>
                  <Pie
                    data={pieChartData}
                    cx="50%"
                    cy="50%"
                    outerRadius={100}
                    fill="#8884d8"
                    dataKey="value"
                    label={({ name, percent }) =>
                      `${name} (${(percent * 100).toFixed(0)}%)`
                    }
                  >
                    {pieChartData.map((entry, index) => (
                      <Cell
                        key={`cell-${index}`}
                        fill={COLORS[index % COLORS.length]}
                      />
                    ))}
                  </Pie>
                  <Tooltip />
                  <Legend />
                </PieChart>
              </ResponsiveContainer>
            </div>
            <div className="description">
              <h4>총 리뷰 수</h4>
              {pieChartData &&
                pieChartData.map((data, i) => (
                  <div key={"review-des" + i}>
                    {data.name} : {data.value}건
                  </div>
                ))}
            </div>
          </div>
        </div>
        <div className="stats">
          <div className="total-title">
            <h3>플랜</h3>
          </div>
          <div className="total-content">
            <div className="chart" style={{ width: "50%", height: "300px" }}>
              <h4>많이 등록된 장소</h4>
              <div> ㅎㅎㅎㅎ</div>
            </div>
            <div className="description">
              <h4>총 플랜 수</h4>
              {planStat && <div>{planStat.planCount}건</div>}
            </div>
          </div>
        </div>
      </div>
      {company && (
        <div className="update-info">
          <div className="info-title">
            <h2>회사정보</h2>
            <IconButton
              onClick={() => {
                setEditMode((prev) => !prev);
              }}
              size="small"
            >
              <DriveFileRenameOutlineIcon
                sx={{ width: 30, height: 30, marginLeft: "4px", color: "#333" }}
              />
            </IconButton>
          </div>
          <form
            className="info-grid"
            onSubmit={(e) => {
              console.log("섭밋");
              e.preventDefault();
              updateCompany();
            }}
          >
            <div className="info-block">
              <label>주소</label>
              <input
                name="addr"
                value={company.addr}
                readOnly={editMode ? false : true}
                onChange={handleChange}
              />
            </div>
            <div className="info-block">
              <label>대표전화</label>
              <input
                name="tel"
                value={company.tel}
                readOnly={editMode ? false : true}
                onChange={handleChange}
              />
            </div>
            <div className="info-block">
              <label>fax</label>
              <input
                name="fax"
                value={company.fax}
                readOnly={editMode ? false : true}
                onChange={handleChange}
              />
            </div>
            <div className="info-block">
              <label>이메일</label>
              <input
                name="email"
                value={company.email}
                readOnly={editMode ? false : true}
                onChange={handleChange}
              />
            </div>
            <button
              type="submit"
              onClick={updateCompany}
              style={{ display: "none" }}
            >
              수정
            </button>
          </form>
        </div>
      )}
    </>
  );
};
export default AdminMain;
