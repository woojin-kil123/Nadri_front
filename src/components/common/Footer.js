import IconButton from "@mui/material/IconButton";
import FacebookIcon from "@mui/icons-material/GitHub";
import LinkedInIcon from "@mui/icons-material/LinkedIn";
import TwitterIcon from "@mui/icons-material/X";
import "./footer.css";
import { useEffect, useState } from "react";
import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  Modal,
  TextField,
} from "@mui/material";
import Terms from "../static/Terms";
import PrivacyPolicy from "../static/PrivacyPolicy";
import axios from "axios";
import { useRecoilValue } from "recoil";
import { companyInfoState } from "../utils/RecoilData";
import Swal from "sweetalert2";
import EventPopup from "../utils/EventPopup";

export default function Footer() {
  const [open, setOpen] = useState(false);
  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);
  const [modalContent, setModalContent] = useState(null);
  const [showPopup, setShowPopup] = useState(false);
  const company = useRecoilValue(companyInfoState);
  const [inquiryOpen, setInquiryOpen] = useState(false); // 모달 오픈 여부 상태
  const [form, setForm] = useState({
    placeTitle: "",
    placeAddr: "",
    placeTel: "",
  });
  const handleRequestChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({
      ...prev,
      [name]: value,
    }));
  };
  const handleSubmit = (event) => {
    event.preventDefault();
    axios
      .post(`${process.env.REACT_APP_BACK_SERVER}/admin/place/request`, form)
      .then(() => {
        Swal.fire({
          title: "문의 완료",
          icon: "success",
          text: "감사합니다! 더 정확한 나드리가 되겠습니다.",
          confirmButtonText: "확인",
        });
        setInquiryOpen(false);
      });
  };

  return (
    <footer className="footer">
      {showPopup && (
        <EventPopup
          onClose={() => {
            setShowPopup(false);
          }}
        />
      )}
      <div className="contact-wrap">
        <div className="footer-left">
          <div className="footer-text">
            <div className="footer-logo">
              <img src="/image/logo_icon_white.png" />
            </div>
            <ul className="footer-info">
              {company && (
                <>
                  <li>📍 {company.addr}</li>
                  <li>
                    📞 {company.tel} / FAX : {company.fax}
                  </li>
                  <li>✉️ {company.email}</li>
                </>
              )}
            </ul>
          </div>
          <div className="social-btn-wrap">
            <IconButton href="#" aria-label="GitHub">
              <FacebookIcon color="inherit" sx={{ width: 50, height: 50 }} />
            </IconButton>
            <IconButton href="#" aria-label="X">
              <TwitterIcon color="inherit" sx={{ width: 50, height: 50 }} />
            </IconButton>
            <IconButton href="#" aria-label="LinkedIn">
              <LinkedInIcon color="inherit" sx={{ width: 50, height: 50 }} />
            </IconButton>
          </div>
        </div>
        <div className="footer-right">
          <div className="link-wrap">
            <ul>
              <h3>CONTACT</h3>
              <li
                onClick={() => {
                  setShowPopup(true);
                }}
              >
                이벤트 및 프로모션
              </li>
              <li
                onClick={() => {
                  setInquiryOpen(true);
                }}
              >
                문의하기
              </li>
            </ul>
            <ul>
              <h3>PRIVACY & TERMS </h3>
              <li
                onClick={() => {
                  setModalContent(<PrivacyPolicy onClose={handleClose} />);
                  handleOpen();
                }}
              >
                개인정보 취급방침 및 쿠키 정책
              </li>
              <li
                onClick={() => {
                  setModalContent(<Terms onClose={handleClose} />);
                  handleOpen();
                }}
              >
                서비스 이용 약관
              </li>
            </ul>
          </div>
          <div className="copyright">
            <p> © 2025 나드리 All rights reserved</p>
            <p>
              대한민국의 한국어 사용자를 대상으로 하는 나드리 웹사이트
              버전입니다.
            </p>
          </div>
        </div>
      </div>
      <Dialog
        open={inquiryOpen}
        onClose={() => {
          setInquiryOpen(false);
        }}
      >
        <DialogTitle>정보 수정 요청</DialogTitle>
        <DialogContentText style={{ padding: "0 25px" }}>
          혹시 방문하신 장소의 정보가 다르게 입력되어 있나요? 알려주신다면 확인
          후 반영하여 더 나은 나드리가 되겠습니다. 감사합니다!!^^
        </DialogContentText>
        <form onSubmit={handleSubmit}>
          <DialogContent>
            <TextField
              name="placeTitle"
              label="장소 이름"
              fullWidth
              margin="dense"
              onChange={handleRequestChange}
              sx={{
                "& label.Mui-focused": {
                  color: "var(--main2)", // 포커스된 라벨 색
                },
                "& .MuiOutlinedInput-root": {
                  "&.Mui-focused fieldset": {
                    borderColor: "var(--main2)", // 포커스된 테두리 색
                  },
                },
              }}
            />
            <TextField
              name="placeAddr"
              label="주소"
              fullWidth
              margin="dense"
              onChange={handleRequestChange}
              sx={{
                "& label.Mui-focused": {
                  color: "var(--main2)", // 포커스된 라벨 색
                },
                "& .MuiOutlinedInput-root": {
                  "&.Mui-focused fieldset": {
                    borderColor: "var(--main2)", // 포커스된 테두리 색
                  },
                },
              }}
            />
            <TextField
              name="placeTel"
              label="문의 및 안내(연락처)"
              fullWidth
              margin="dense"
              onChange={handleRequestChange}
              sx={{
                "& label.Mui-focused": {
                  color: "var(--main2)", // 포커스된 라벨 색
                },
                "& .MuiOutlinedInput-root": {
                  "&.Mui-focused fieldset": {
                    borderColor: "var(--main2)", // 포커스된 테두리 색
                  },
                },
              }}
            />
          </DialogContent>
          <DialogActions>
            <Button
              onClick={() => {
                setInquiryOpen(false);
              }}
              sx={{
                backgroundColor: "white",
                color: "var(--main2)",
                "&:hover": { backgroundColor: "#efefef" },
              }}
            >
              취소
            </Button>
            <Button
              type="submit"
              variant="contained"
              sx={{
                backgroundColor: "var(--main2)",
                color: "white",
                "&:hover": { backgroundColor: "var(--main3)" },
              }}
            >
              전송
            </Button>
          </DialogActions>
        </form>
      </Dialog>
      <Modal open={open} onClose={handleClose}>
        <div className="footer-modal">{modalContent}</div>
      </Modal>
    </footer>
  );
}
