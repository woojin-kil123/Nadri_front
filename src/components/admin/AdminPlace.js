import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Button,
} from "@mui/material";
import axios from "axios";
import { useEffect, useState } from "react";
import Swal from "sweetalert2";
import { Box, Tab, Tabs } from "@mui/material";

const AdminPlace = () => {
  const backServer = process.env.REACT_APP_BACK_SERVER;
  const [requests, setRequests] = useState([]);
  const [editForm, setEditForm] = useState(null);
  const [open, setOpen] = useState(false);
  const [tab, setTab] = useState(1);

  useEffect(() => {
    loadRequests(0);
  }, []);

  const handleTabChange = (_, newValue) => {
    setTab(newValue);
    if (newValue === 1) loadRequests(0); // 사용자 수정 리퀘스트 목록
    else if (newValue === 2) loadRequests(1); // 수정 완료 목록
  };

  const loadRequests = (status) => {
    axios
      .get(`${backServer}/admin/place/request`, { params: { status } })
      .then((res) => {
        setRequests(res.data);
      })
      .catch((err) => console.log(err));
  };

  const handleEditClick = (request) => {
    setEditForm({ ...request });
    setOpen(true);
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setEditForm((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleClose = () => {
    setOpen(false);
    setEditForm(null);
  };

  const handleSave = () => {
    axios
      .patch(`${backServer}/admin/place/update/request`, editForm)
      .then(() => {
        Swal.fire({
          title: "수정 완료",
          icon: "success",
          text: "수정을 완료하였습니다.",
          confirmButtonText: "확인",
        });
        handleClose();
        loadRequests(0);
      });
  };

  const EditConfirmClick = (req) => {
    setRequests((prev) => prev.filter((r) => r.requestNo !== req.requestNo));
  };

  return (
    <div className="admin place-tbl-wrap">
      <div className="request-place-title">
        <h2>플레이스 기본정보 수정요청 목록</h2>
      </div>
      <Box>
        <Tabs value={tab} onChange={handleTabChange}>
          <Tab value={1} label="수정 요청 목록" />
          <Tab value={2} label="수정 완료" />
        </Tabs>

        <table className="admin-table place-tbl tbl">
          <thead>
            <tr>
              <th style={{ width: "12%" }}>place_id</th>
              <th style={{ width: "18%" }}>장소이름</th>
              <th style={{ width: "25%" }}>주소</th>
              <th style={{ width: "15%" }}>문의처(연락처)</th>
              <th style={{ width: "20%" }}>요청일</th>
              <th style={{ width: "10%" }}>수정</th>
            </tr>
          </thead>
          <tbody>
            {requests.map((req) => (
              <tr key={req.requestNo}>
                <td>{req.placeId}</td>
                <td>{req.placeTitle}</td>
                <td>{req.placeAddr}</td>
                <td>{req.placeTel}</td>
                <td>{req.requestDate}</td>
                <td>
                  {tab === 1 && (
                    <button
                      className="btn-primary admin-place"
                      onClick={() => handleEditClick(req)}
                    >
                      수정
                    </button>
                  )}
                  {tab === 2 && (
                    <button
                      style={{ backgroundColor: "var(--main5)" }}
                      className="btn-primary admin-place"
                      onClick={() => EditConfirmClick(req)}
                    >
                      확인
                    </button>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </Box>

      <Dialog open={open} onClose={handleClose}>
        <DialogTitle>장소 정보 수정</DialogTitle>
        <DialogContent>
          <TextField
            name="placeTitle"
            label="장소 이름"
            value={editForm?.placeTitle || ""}
            fullWidth
            margin="dense"
            onChange={handleChange}
            sx={{
              "& label.Mui-focused": {
                color: "var(--main2)",
              },
              "& .MuiOutlinedInput-root": {
                "&.Mui-focused fieldset": {
                  borderColor: "var(--main2)",
                },
              },
            }}
          />
          <TextField
            name="placeAddr"
            label="주소"
            value={editForm?.placeAddr || ""}
            fullWidth
            margin="dense"
            onChange={handleChange}
            sx={{
              "& label.Mui-focused": {
                color: "var(--main2)",
              },
              "& .MuiOutlinedInput-root": {
                "&.Mui-focused fieldset": {
                  borderColor: "var(--main2)",
                },
              },
            }}
          />
          <TextField
            name="placeTel"
            label="문의처(연락처)"
            value={editForm?.placeTel || ""}
            fullWidth
            margin="dense"
            onChange={handleChange}
            sx={{
              "& label.Mui-focused": {
                color: "var(--main2)",
              },
              "& .MuiOutlinedInput-root": {
                "&.Mui-focused fieldset": {
                  borderColor: "var(--main2)",
                },
              },
            }}
          />
        </DialogContent>
        <DialogActions>
          <Button
            onClick={handleClose}
            sx={{
              backgroundColor: "white",
              color: "var(--main2)",
              "&:hover": { backgroundColor: "#efefef" },
            }}
          >
            취소
          </Button>
          <Button
            onClick={handleSave}
            sx={{
              backgroundColor: "var(--main2)",
              color: "white",
              "&:hover": { backgroundColor: "var(--main3)" },
            }}
          >
            저장
          </Button>
        </DialogActions>
      </Dialog>
    </div>
  );
};
export default AdminPlace;
