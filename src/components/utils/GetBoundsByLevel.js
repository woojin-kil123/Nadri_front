const GetBoundsByLevel = (level) => {
  const clampedLevel = Math.min(level, 6);
  const baseWidth = 0.0215;
  const baseHeight = 0.0112;
  const multiplier = Math.pow(2, clampedLevel - 3);

  return {
    width: baseWidth * multiplier,
    height: baseHeight * multiplier,
  };
};

export default GetBoundsByLevel;
