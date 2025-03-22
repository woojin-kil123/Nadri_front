import IconButton from "@mui/material/IconButton";
import Stack from "@mui/material/Stack";
import FacebookIcon from "@mui/icons-material/GitHub";
import LinkedInIcon from "@mui/icons-material/LinkedIn";
import TwitterIcon from "@mui/icons-material/X";
import { Link } from "react-router-dom";

export default function Footer() {
  return (
    <footer className="footer">
      <div className="introduce">
        <img src="/image/default_img.png" />
        <div className="link-list">
          <div className="contact">
            <div>
              Product
              <ul>
                <li>
                  <Link to="#">Features</Link>
                </li>
                <li>
                  <Link to="#">Testimonials</Link>
                </li>
                <li>
                  <Link to="#">Highlights</Link>
                </li>
                <li>
                  <Link to="#">Pricing</Link>
                </li>
                <li>
                  <Link to="#">FAQs</Link>
                </li>
              </ul>
            </div>
            <div>
              Company
              <ul>
                <li>
                  <Link to="#">About us</Link>
                </li>
                <li>
                  <Link to="#">Careers</Link>
                </li>
                <li>
                  <Link to="#">Press</Link>
                </li>
              </ul>
            </div>
            <div>
              Legal
              <ul>
                <li>
                  <Link to="#">Terms</Link>
                </li>
                <li>
                  <Link to="#">Privacy</Link>
                </li>
                <li>
                  <Link to="#">Contact</Link>
                </li>
              </ul>
            </div>
          </div>
          <div className="footer2">
            <div>
              <Link to="#">개인정보 취급방침 및 쿠키 정책</Link>
              <br />
              <Link to="#">이용 약관</Link>
            </div>
            <Stack
              direction="row"
              spacing={1}
              useFlexGap
              sx={{ justifyContent: "left", color: "text.secondary" }}
            >
              <IconButton
                color="inherit"
                href="https://github.com/mui"
                aria-label="GitHub"
              >
                <FacebookIcon />
              </IconButton>
              <IconButton
                color="inherit"
                href="https://x.com/MaterialUI"
                aria-label="X"
              >
                <TwitterIcon />
              </IconButton>
              <IconButton
                color="inherit"
                href="https://www.linkedin.com/company/mui/"
                aria-label="LinkedIn"
              >
                <LinkedInIcon />
              </IconButton>
            </Stack>
          </div>
          <div>
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
