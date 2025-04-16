import IconButton from "@mui/material/IconButton";
import FacebookIcon from "@mui/icons-material/GitHub";
import LinkedInIcon from "@mui/icons-material/LinkedIn";
import TwitterIcon from "@mui/icons-material/X";
import "./footer.css";
import { useEffect, useState } from "react";
import { Modal } from "@mui/material";
import Terms from "../static/Terms";
import PrivacyPolicy from "../static/PrivacyPolicy";
import axios from "axios";
import { useRecoilValue } from "recoil";
import { companyInfoState } from "../utils/RecoilData";

export default function Footer() {
  const [open, setOpen] = useState(false);
  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);
  const [modalContent, setModalContent] = useState(null);
  const company = useRecoilValue(companyInfoState);

  return (
    <footer className="footer">
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
              <li>이벤트 및 프로모션</li>
              <li>문의하기</li>
            </ul>
            <ul>
              <h3>PRIVACY & TERMS </h3>
              <li
                onClick={() => {
                  setModalContent(<PrivacyPolicy />);
                  handleOpen();
                }}
              >
                개인정보 취급방침 및 쿠키 정책
              </li>
              <li
                onClick={() => {
                  setModalContent(<Terms />);
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
      <Modal open={open} onClose={handleClose}>
        <div className="footer-modal">{modalContent}</div>
      </Modal>
    </footer>
  );
}
