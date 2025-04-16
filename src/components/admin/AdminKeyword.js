import axios from "axios";
import { useEffect, useState } from "react";
import { getKoreanToday } from "../utils/metaSet";
import {
  Autocomplete,
  Button,
  FormControl,
  FormHelperText,
  IconButton,
  Input,
  InputLabel,
  MenuItem,
  OutlinedInput,
  Select,
  TextField,
} from "@mui/material";
import { useRecoilValue } from "recoil";
import { placeTypeState } from "../utils/RecoilData";
import Swal from "sweetalert2";

const AdminKeyword = () => {
  const inputStyle = {
    width: "200px",
    height: "40px",
    fontSize: "14px",
    borderRadius: "4px",
    "& .MuiOutlinedInput-notchedOutline": {
      borderColor: "#ccc",
    },
    "&:hover .MuiOutlinedInput-notchedOutline": {
      borderColor: "#27b778",
    },
    "&.Mui-focused .MuiOutlinedInput-notchedOutline": {
      borderColor: "#27b778",
    },
  };
  const [popular, setPopular] = useState();
  const today = getKoreanToday();
  const placeType = useRecoilValue(placeTypeState);

  const [cat1, setCat1] = useState([]);
  const [cat2, setCat2] = useState([]);
  const [cat3, setCat3] = useState([]);
  const [area, setArea] = useState([]);
  useEffect(() => {
    axios
      .get(`${process.env.REACT_APP_BACK_SERVER}/search/popular?date=${today}`)
      .then((res) => {
        setPopular(res.data);
      });
  }, []);
  useEffect(() => {
    axios
      .get(`${process.env.REACT_APP_BACK_SERVER}/place/category`)
      .then((res) => {
        setCat1(res.data.cat1);
        setCat2(res.data.cat2);
        setCat3(res.data.cat3);
      });
  }, []);
  useEffect(() => {
    axios.get(`${process.env.REACT_APP_BACK_SERVER}/place/area`).then((res) => {
      setArea(res.data);
    });
  }, []);
  const [formData, setFormData] = useState({
    keyword: "",
    placeType: "",
    cat1: "",
    cat2: "",
    cat3: "",
    area: "",
    placeId: "",
  });
  const selectKeywordInfo = () => {
    const keyword = formData.keyword;
    axios
      .get(`${process.env.REACT_APP_BACK_SERVER}/admin/keyword/${keyword}`)
      .then((res) => {
        setFormData(res.data);
      });
  };
  const updateKeyword = () => {
    axios
      .patch(`${process.env.REACT_APP_BACK_SERVER}/admin/keyword`, formData)
      .then((res) => {
        if (res.data > 0) {
          Swal.fire({
            title: "변경 완료",
          }).then(() => {
            setFormData({
              keyword: "",
              placeType: 0,
              cat1: "",
              cat2: "",
              cat3: "",
              area: "",
              placeId: "",
            });
          });
        }
      });
  };
  useEffect(() => {
    console.log("🟢 formData updated:", formData);
  }, [formData]);
  return (
    <div className="hot-keyword-wrap">
      <h2>인기 검색어</h2>
      <div className="popular border">
        {popular && (
          <>
            <PopularKeywordTable title="일간" data={popular.daily} />
            <PopularKeywordTable title="주간" data={popular.weekly} />
            <PopularKeywordTable title="월간" data={popular.monthly} />
            <PopularKeywordTable title="연간" data={popular.yearly} />
          </>
        )}
      </div>
      <h2>키워드 관리</h2>
      <div className="keyword-manage border">
        <div className="check">
          <form
            onSubmit={(e) => {
              e.preventDefault();
              if (formData.keyword) {
                selectKeywordInfo();
              }
            }}
          >
            <AutocompleteForm
              id="keyword"
              label="키워드 검색"
              formData={formData}
              setFormData={setFormData}
              controller="keyword"
            />
            <IconButton
              type="button"
              sx={{ p: "10px" }}
              className="keyword-submit"
              onClick={selectKeywordInfo}
            >
              조회
            </IconButton>
          </form>
        </div>
        <div className="insert">
          <h3>키워드 업데이트</h3>
          <form
            onSubmit={(e) => {
              e.preventDefault();
              updateKeyword();
            }}
          >
            <div className="info-grid">
              <div className="input-wrap">
                <InputLabel
                  shrink
                  id="keyword-label"
                  sx={{
                    position: "static",
                    transform: "none",
                    fontSize: "14px",
                    marginBottom: "4px",
                    color: "#333",
                    "&.Mui-focused": {
                      color: "#3d3d3d",
                      fontFamily: "ns-b",
                    },
                    "& .MuiFormLabel-asterisk": {
                      display: "none",
                    },
                  }}
                >
                  키워드
                </InputLabel>
                <OutlinedInput
                  notched={false}
                  value={formData.keyword}
                  onChange={(e) =>
                    setFormData((prev) => ({
                      ...prev,
                      keyword: e.target.value,
                    }))
                  }
                  sx={inputStyle}
                  name="keyword"
                />
              </div>
              <SelectForm
                inputStyle={inputStyle}
                formData={formData}
                setFormData={setFormData}
                cat={placeType}
                id="placeType"
                label="타입"
              />
              <SelectForm
                inputStyle={inputStyle}
                formData={formData}
                setFormData={setFormData}
                cat={area}
                id="area"
                label="지역"
              />
              <SelectForm
                inputStyle={inputStyle}
                formData={formData}
                setFormData={setFormData}
                cat={cat1}
                id="cat1"
                label="카테고리1"
              />
              <SelectForm
                inputStyle={inputStyle}
                formData={formData}
                setFormData={setFormData}
                cat={cat2}
                id="cat2"
                label="카테고리2"
              />
              <SelectForm
                inputStyle={inputStyle}
                formData={formData}
                setFormData={setFormData}
                cat={cat3}
                id="cat3"
                label="카테고리3"
              />
            </div>
            <AutocompleteForm
              id="placeId"
              label="장소 조회"
              formData={formData}
              setFormData={setFormData}
              controller="place"
            />
            <IconButton
              type="button"
              sx={{ p: "10px" }}
              className="keyword-submit"
              onClick={updateKeyword}
            >
              변경
            </IconButton>
          </form>
        </div>
      </div>
    </div>
  );
};
export default AdminKeyword;

const AutocompleteForm = ({ id, label, formData, setFormData, controller }) => {
  const [inputText, setInputText] = useState("");
  const [check, setCheck] = useState([]);
  let key = "id";

  if (controller === "keyword") {
    key = "name";
  }
  useEffect(() => {
    if (!inputText) return setCheck([]);
    const lastChar = inputText.slice(-1);
    const isKoreanSyllable =
      lastChar &&
      lastChar.charCodeAt(0) >= 0xac00 &&
      lastChar.charCodeAt(0) <= 0xd7a3;
    if (!isKoreanSyllable) return;
    axios
      .get(
        `${process.env.REACT_APP_BACK_SERVER}/search/${controller}?query=${inputText}`
      )
      .then((res) => {
        setCheck(res.data);
      });
  }, [inputText]);
  const onChange = (e, newValue) => {
    setFormData((prev) => ({
      ...prev,
      [id]: newValue?.[key] || "",
    }));
  };
  return (
    <Autocomplete
      disablePortal
      options={check}
      value={check.find((opt) => opt[key] === formData[id]) || null}
      onChange={onChange}
      inputValue={inputText}
      onInputChange={(e, val) => setInputText(val)}
      getOptionLabel={(option) => `${option.name} | ID:${option.id} `}
      isOptionEqualToValue={(option, value) => option[key] === value[key]}
      noOptionsText="결과 없음"
      sx={{ mt: 3 }}
      renderInput={(params) => (
        <TextField
          {...params}
          className="input-wrap autocomplete"
          label={label}
          variant="outlined"
          InputProps={{
            ...params.InputProps,
            notched: false,
          }}
          slotProps={{
            inputLabel: {
              sx: {
                position: "static",
                transform: "none",
                fontSize: "14px",
                p: "1",
                color: "#333",
                "&.Mui-focused": {
                  color: "#3d3d3d",
                },
                "& .MuiFormLabel-asterisk": {
                  display: "none",
                },
              },
            },
          }}
        />
      )}
    />
  );
};
const SelectForm = ({ inputStyle, formData, setFormData, cat, id, label }) => {
  const handleChange = (e) => {
    const value = e.target.value; // ✅ 문자열 그대로 유지
    setFormData((prev) => ({ ...prev, [id]: value }));
  };

  return (
    <div className="input-wrap">
      <InputLabel
        shrink
        id={`${id}-label`}
        sx={{
          position: "static",
          transform: "none",
          fontSize: "14px",
          color: "#333",
          "&.Mui-focused": {
            color: "#3d3d3d",
            fontFamily: "ns-b",
          },
          "& .MuiFormLabel-asterisk": {
            display: "none",
          },
        }}
      >
        {label}
      </InputLabel>
      <Select
        labelId={`${id}-label`}
        name={id}
        value={formData[id] ?? ""} // ✅ 0 등 falsy 값도 살림
        label={label}
        onChange={handleChange}
        input={<OutlinedInput notched={false} sx={inputStyle} />}
      >
        <MenuItem value="">
          <span>해당없음</span>
        </MenuItem>
        {cat.map((c, i) => (
          <MenuItem key={`${c.id}-${i}`} value={String(c.id)}>
            {c.name}
          </MenuItem>
        ))}
      </Select>
    </div>
  );
};

const PopularKeywordTable = ({ title, data }) => {
  return (
    <div className="keyword-table-wrapper">
      <div className="keyword-table-section">
        <h3 className="keyword-section-title">{title}</h3>
        <table className="keyword-table">
          <thead>
            <tr>
              <th>순위</th>
              <th>검색어</th>
              <th>조회수</th>
            </tr>
          </thead>
          <tbody>
            {data.map((item, i) => (
              <tr key={i}>
                <td>{i + 1}</td>
                <td>{item.query}</td>
                <td>{item.count}회</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};
