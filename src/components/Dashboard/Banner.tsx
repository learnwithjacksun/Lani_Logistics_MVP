import { useEffect, useState } from "react";

const Banner = () => {
  const [timeLeft, setTimeLeft] = useState(86400); // 1 hour countdown

  useEffect(() => {
    const timer = setInterval(() => {
      setTimeLeft((prev) => (prev > 0 ? prev - 1 : 0));
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  const formatTime = (seconds: number) => {
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    const secs = seconds % 60;
    return `${String(hours).padStart(2, "0")}:${String(minutes).padStart(
      2,
      "0"
    )}:${String(secs).padStart(2, "0")}`;
  };

  return (
    <>
      <div className="relative mb-4 overflow-hidden p-6 rounded-2xl bg-gradient-to-br from-orange-500 to-orange-950">
        <div>
          <h1 className="text-white font-dm text-sm">
            🎉 Launch Special! &nbsp;
            <span className="text-yellow-300">60% Off</span> for the First 2
            Weeks!
          </h1>
          <h1 className="text-white text-4xl font-bold">
            {formatTime(timeLeft)} <span className="text-xs font-normal">Time left</span>
          </h1>
        </div>
        <div className="absolute top-0 left-0 w-full h-2 bg-yellow-300"></div>
      </div>
    </>
  );
};

export default Banner;
