import "./main.css";
import React, { useEffect, useState } from "react";
import { Box, Typography, Button } from "@mui/material";

const slides = [
  {
    title: "나만의 여행을 계획하세요",
    description: "여행 일정을 공유하고 함께 할 수 있어요",
    image: "/image/intro_plan.png",
  },
  {
    title: "꼭 가보고 싶은 곳이 있었나요?",
    description: "검색을 통해 원하시는 정보를 찾으세요",
    image: "/image/intro_spot.png",
  },
  {
    title: "편하게 머물 수 있는 공간들부터",
    description: "여러분들의 솔직한 평가를 나누세요",
    image: "/image/intro_hotel.png",
  },
  {
    title: "재미있는 즐길거리까지",
    description: "여러분이 원한 맞춤 추천을 제공합니다",
    image: "/image/intro_content.png",
  },
  {
    title: "실시간 채팅과 다양한 리뷰와 함께",
    description: "친구들과 편하게 여행을 계획해보세요",
    image: "/image/intro_chat.png",
  },
];

const IntroSlider = () => {
  const [activeIndex, setActiveIndex] = useState(0);

  // 자동 슬라이드 전환 (5초 간격)
  useEffect(() => {
    const interval = setInterval(() => {
      setActiveIndex((prev) => (prev + 1) % slides.length);
    }, 5000);
    return () => clearInterval(interval);
  }, []);

  const handleDotClick = (index) => {
    setActiveIndex(index);
  };

  return (
    <div className="intro-wrap">
      <div className="intro">
        {/* Left text section */}
        <div className="intro-text">
          <h2>{slides[activeIndex].title}</h2>
          <p>{slides[activeIndex].description}</p>
          <button className="btn-primary">시작하기</button>
        </div>

        {/* Right image section */}
        <div className="intro-img">
          <img
            src={slides[activeIndex].image}
            alt="slide"
            style={{ width: "100%", borderRadius: "8px" }}
          />
        </div>
      </div>
      {/* 하단 원형 페이지네이션 */}
      <Box sx={{ mt: 4, display: "flex", justifyContent: "center", gap: 1 }}>
        {slides.map((_, index) => (
          <Box
            key={index}
            onClick={() => handleDotClick(index)}
            sx={{
              width: 12,
              height: 12,
              borderRadius: "50%",
              backgroundColor: index === activeIndex ? "#2ecc71" : "#888",
              cursor: "pointer",
              transition: "background-color 0.3s",
            }}
          />
        ))}
      </Box>
    </div>
  );
};

export default IntroSlider;
