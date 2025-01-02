import { useState, useEffect, TouchEvent } from "react";
import { Link } from "react-router-dom";
import Brand from "../components/Common/Brand";
import { slides } from "../Constants/data";



const Home = () => {
  const [currentSlide, setCurrentSlide] = useState(0);
  const [touchStart, setTouchStart] = useState<number>(0);
  const [touchEnd, setTouchEnd] = useState<number>(0);

  // Auto-slide functionality
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentSlide((prev) => (prev === slides.length - 1 ? 0 : prev + 1));
    }, 3000);

    return () => clearInterval(timer);
  }, []);

  // Touch handlers
  const handleTouchStart = (e: TouchEvent) => {
    setTouchStart(e.targetTouches[0].clientX);
  };

  const handleTouchMove = (e: TouchEvent) => {
    setTouchEnd(e.targetTouches[0].clientX);
  };

  const handleTouchEnd = () => {
    if (touchStart - touchEnd > 75) {
      setCurrentSlide(prev => (prev === slides.length - 1 ? 0 : prev + 1));
    }

    if (touchStart - touchEnd < -75) {
      setCurrentSlide(prev => (prev === 0 ? slides.length - 1 : prev - 1));
    }
  };

  return (
    <>
      <div className="layout h-[100dvh] flex flex-col items-center justify-between py-10">
        <Brand />


        <div className=" flex flex-col gap-10">
          <div className="relative">
            <div className="overflow-hidden">
              <div 
                className="flex transition-transform duration-500 ease-in-out"
                style={{ transform: `translateX(-${
                  currentSlide * 100}%)` }}
                onTouchStart={handleTouchStart}
                onTouchMove={handleTouchMove}
                onTouchEnd={handleTouchEnd}
              >
                {slides.map((slide, index) => (
                  <div key={index} className="text-center min-w-full">
                    <h2 className="text-[30px] font-bold text-main capitalize">
                      {slide.title}
                    </h2>
                    <p className="text-sub font-dm text-sm">
                      {slide.description}
                    </p>
                  </div>
                ))}
              </div>
            </div>
            <div className="flex justify-center gap-2 mt-4">
              {slides.map((_, index) => (
                <button
                  key={index}
                  onClick={() => setCurrentSlide(index)}
                  className={`w-2 h-2 rounded-full bg-primary_1 ${
                    currentSlide === index ? 'opacity-100' : 'opacity-40'
                  }`}
                ></button>
              ))}
            </div>
          </div>

          <div className="flex md:flex-row flex-col gap-2">
            <Link to="/login" className="btn btn-primary min-h-10 flex-1 rounded-full">
              Login
            </Link>
            <Link to="/register" className="btn border bg-background border-line text-main min-h-10 flex-1 rounded-full">
              Create new account
            </Link>
          </div>
        </div>
      </div>
    </>
  );
};

export default Home;
