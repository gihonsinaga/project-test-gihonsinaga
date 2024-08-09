import React, { useState, useEffect } from "react";
import axios from "axios";

export default function Banner() {
  const [imageUrl, setImageUrl] = useState("/assets/banner.jpeg");
  const [scrollY, setScrollY] = useState(0);

  useEffect(() => {
    const fetchImage = async () => {
      try {
        const response = await axios.get("URL_API_CMS");
        setImageUrl(response.data.imageUrl);
      } catch (error) {
        console.error("Error fetching image URL:", error);
      }
    };
    fetchImage();
  }, []);

  useEffect(() => {
    const handleScroll = () => setScrollY(window.scrollY);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <div>
      <div className="relative overflow-hidden h-[500px] sm:h-[600px]">
        <div
          className="absolute inset-0 bg-cover bg-center"
          style={{
            backgroundImage: `url(${imageUrl})`,
            transform: `translateY(${scrollY * 0.5}px)`,
          }}
        ></div>
        <div className="absolute inset-0 bg-gradient-to-b from-transparent to-white transform rotate-2 origin-bottom-left"></div>
        <div
          className="relative flex flex-col justify-center items-center text-center p-6"
          style={{ transform: `translateY(${scrollY * 0.2}px)` }}
        >
          <h1 className="text-white font-bold text-5xl sm:text-6xl mb-4">
            Ideas
          </h1>
          <p className="text-white text-lg sm:text-xl">
            Where all our great things begin
          </p>
        </div>
      </div>
    </div>
  );
}
