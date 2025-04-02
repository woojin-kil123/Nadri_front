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
          <h1 className="footer-logo">Nadri</h1>
          <ul className="footer-info">
            <li>📍 미라특별시 비즈구 미래로123길 45 비즈빌딩 3F</li>
            <li>📞 00-0000-0000 / FAX : 00-0000-0000</li>
            <li>🌐 http://www.bizhowsenglish.com</li>
            <li>✉️ bizhowsenglish@bizhows.com</li>
          </ul>
        </div>
        <div className="footer-right">
          <Stack
            direction="row"
            spacing={1}
            useFlexGap
            sx={{ justifyContent: "left", color: "text.secondary" }}
          >
            <IconButton href="#" aria-label="GitHub">
              <FacebookIcon color="inherit" />
            </IconButton>
            <IconButton href="#" aria-label="X">
              <TwitterIcon color="inherit" />
            </IconButton>
            <IconButton href="#" aria-label="LinkedIn">
              <LinkedInIcon color="inherit" />
            </IconButton>
          </Stack>
          <div>
            <Link to="#">개인정보 취급방침 및 쿠키 정책</Link>
          </div>
          <div>
            <Link to="#">이용 약관</Link>
          </div>
        </div>
      </div>
      <div className="copyright">
        <p> © 2025 나드리 All rights reserved</p>
        <p>
          대한민국의 한국어 사용자를 대상으로 하는 나드리 웹사이트 버전입니다.
        </p>
      </div>
    </footer>
  );
}
