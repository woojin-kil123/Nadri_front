const DrawPlannerPathCanvas = (plannedPlaceList) => {
  if (!plannedPlaceList || plannedPlaceList.length === 0) return;

  const canvasSize = 480;
  const canvasOffset = canvasSize * 0.2;

  let minLat = Infinity,
    maxLat = -Infinity;
  let minLng = Infinity,
    maxLng = -Infinity;

  plannedPlaceList.forEach((p) => {
    const { lat, lng } = p.placeLatLng;
    minLat = Math.min(minLat, lat);
    maxLat = Math.max(maxLat, lat);
    minLng = Math.min(minLng, lng);
    maxLng = Math.max(maxLng, lng);
  });

  const canvas = document.createElement("canvas");
  canvas.width = canvasSize;
  canvas.height = canvasSize;
  const ctx = canvas.getContext("2d");

  const scaleX = (canvas.width - canvasOffset * 2) / (maxLng - minLng || 1);
  const scaleY = (canvas.height - canvasOffset * 1.5) / (maxLat - minLat || 1);

  // 배경
  ctx.fillStyle = "#eee";
  ctx.fillRect(0, 0, canvas.width, canvas.height);

  // 선 스타일
  ctx.strokeStyle = "#FF5B5B";
  ctx.lineJoin = "round";
  ctx.lineCap = "round";
  ctx.lineWidth = 4;

  ctx.beginPath();

  plannedPlaceList.forEach((p, i) => {
    const { lat, lng } = p.placeLatLng;
    const x = canvasOffset + (lng - minLng) * scaleX;
    const y = canvas.height - canvasOffset - (lat - minLat) * scaleY;

    if (i === 0) {
      ctx.moveTo(x, y);
    } else {
      ctx.lineTo(x, y);
    }
  });

  ctx.stroke();

  // 시작/종료 마커
  const start = plannedPlaceList[0].placeLatLng;
  const end = plannedPlaceList[plannedPlaceList.length - 1].placeLatLng;

  const startX = canvasOffset + (start.lng - minLng) * scaleX;
  const startY = canvas.height - canvasOffset - (start.lat - minLat) * scaleY;
  const endX = canvasOffset + (end.lng - minLng) * scaleX;
  const endY = canvas.height - canvasOffset - (end.lat - minLat) * scaleY;

  ctx.fillStyle = "#FF5B5B";
  ctx.beginPath();
  ctx.arc(startX, startY, 5, 0, Math.PI * 2);
  ctx.arc(endX, endY, 5, 0, Math.PI * 2);
  ctx.fill();

  // 아이콘 표시
  ctx.font = "18px Arial";
  ctx.fillText("👟", startX + 8, startY + 6);
  ctx.fillText("⛳", endX + 8, endY + 6);

  return canvas; // <canvas> DOM Element 반환
};

export default DrawPlannerPathCanvas;
