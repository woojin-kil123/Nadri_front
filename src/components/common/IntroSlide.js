import React, { useState } from "react";
import {
  Box,
  Typography,
  Button,
  MobileStepper,
  useTheme,
} from "@mui/material";
import KeyboardArrowLeft from "@mui/icons-material/KeyboardArrowLeft";
import KeyboardArrowRight from "@mui/icons-material/KeyboardArrowRight";

const steps = [
  {
    title: "나만의 여행을 계획하세요",
    description: "일정을 공유하고 함께 할 수 있어요",
    countdown: { hours: 23, days: 5, minutes: 59, seconds: 35 },
  },
  {
    title: "여행지 추천부터 계획까지",
    description: "알고리즘 기반 맞춤 추천을 제공합니다",
  },
  {
    title: "친구들과 실시간 채팅",
    description: "실시간 채팅으로 함께 계획해요",
  },
];

const IntroSlider = () => {
  const [activeStep, setActiveStep] = useState(0);
  const theme = useTheme();
  const maxSteps = steps.length;

  const handleNext = () =>
    setActiveStep((prev) => Math.min(prev + 1, maxSteps - 1));
  const handleBack = () => setActiveStep((prev) => Math.max(prev - 1, 0));

  return (
    <Box
      sx={{
        width: "100%",
        height: "500px",
        background: "radial-gradient(circle, #222 0%, #000 100%)",
        color: "#fff",
        display: "flex",
        flexDirection: "column",
        justifyContent: "space-between",
        alignItems: "center",
        p: 4,
      }}
    >
      <Box
        sx={{
          flex: 1,
          display: "flex",
          width: "100%",
          alignItems: "center",
          justifyContent: "space-between",
        }}
      >
        {/* Left content */}
        <Box sx={{ maxWidth: 500 }}>
          <Typography
            variant="h4"
            fontWeight="bold"
            gutterBottom
            sx={{ color: "white" }}
          >
            {steps[activeStep].title}
          </Typography>
          <Typography variant="subtitle1" gutterBottom sx={{ color: "white" }}>
            {steps[activeStep].description}
          </Typography>

          {/* Countdown section for first slide only */}
          {activeStep === 0 && (
            <Box sx={{ display: "flex", gap: 2, mt: 3 }}>
              {["Hours", "Days", "Minutes", "Seconds"].map((unit, idx) => (
                <Box
                  key={unit}
                  sx={{
                    width: 60,
                    height: 60,
                    borderRadius: "50%",
                    backgroundColor: "#fff",
                    color: "#000",
                    display: "flex",
                    flexDirection: "column",
                    alignItems: "center",
                    justifyContent: "center",
                    fontSize: 14,
                    fontWeight: "bold",
                  }}
                >
                  {Object.values(steps[0].countdown)[idx]}
                  <Typography variant="caption">{unit}</Typography>
                </Box>
              ))}
            </Box>
          )}

          <Button
            variant="contained"
            sx={{
              mt: 4,
              backgroundColor: "#4CAF50",
              "&:hover": { backgroundColor: "#43A047" },
            }}
          >
            시작하기
          </Button>
        </Box>

        {/* Right side - visual placeholder */}
        <Box
          sx={{
            flex: 1,
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
          }}
        >
          <Box
            sx={{
              width: 400,
              height: 300,
              backgroundColor: "#333",
              borderRadius: 4,
              boxShadow: 3,
            }}
          />
        </Box>
      </Box>

      {/* Stepper */}
      <MobileStepper
        variant="dots"
        steps={maxSteps}
        position="static"
        activeStep={activeStep}
        nextButton={
          <Button
            size="small"
            onClick={handleNext}
            disabled={activeStep === maxSteps - 1}
          >
            다음
            {theme.direction === "rtl" ? (
              <KeyboardArrowLeft />
            ) : (
              <KeyboardArrowRight />
            )}
          </Button>
        }
        backButton={
          <Button size="small" onClick={handleBack} disabled={activeStep === 0}>
            {theme.direction === "rtl" ? (
              <KeyboardArrowRight />
            ) : (
              <KeyboardArrowLeft />
            )}
            이전
          </Button>
        }
        sx={{ backgroundColor: "transparent", color: "#fff" }}
      />
    </Box>
  );
};

export default IntroSlider;
