import IconButton from "@mui/material/IconButton";
import Stack from "@mui/material/Stack";
import FacebookIcon from "@mui/icons-material/GitHub";
import LinkedInIcon from "@mui/icons-material/LinkedIn";
import TwitterIcon from "@mui/icons-material/X";
import { Link } from "react-router-dom";
import "./footer.css";

export default function Footer() {
  return (
    <footer className="footer">
      <div className="contact-wrap">
        <div className="footer-left">
          <div className="footer-text">
            <div className="footer-logo">
              <img src="/image/nadri_logo.svg" />
            </div>
            <ul className="footer-info">
              <li>📍 미라특별시 비즈구 미래로123길 45 비즈빌딩 3F</li>
              <li>📞 00-0000-0000 / FAX : 00-0000-0000</li>
              <li>🌐 http://www.bizhowsenglish.com</li>
              <li>✉️ bizhowsenglish@bizhows.com</li>
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
            <div>
              <h3>CONTACT</h3>
              <p>
                <Link to="#">이벤트 및 프로모션</Link>
              </p>
              <p>
                <Link to="#">일반 문의</Link>
              </p>
              <p>
                <Link to="#">제휴 문의</Link>
              </p>
            </div>
            <div>
              <h3>TERMS</h3>
              <p>
                <Link to="#">개인정보 취급방침 및 쿠키 정책</Link>
              </p>
              <p>
                <Link to="#">이용 약관</Link>
              </p>
            </div>
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
    </footer>
  );
}
