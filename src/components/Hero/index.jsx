"use client";
import React, { useState, useEffect } from "react";
import Image from "next/image";

const Hero = () => {
  const [dateControl, setDateControl] = useState(false);
  const [dateValue, setDateValue] = useState(
    new Date().toISOString().split("T")[0]
  );
  const [getData, setGetData] = useState(null);

  useEffect(() => {
    const savedDateControl = localStorage.getItem("dateControl");
    const savedDateValue = localStorage.getItem("dateValue");
    const savedGetData = localStorage.getItem("getData");

    if (savedDateControl) {
      setDateControl(JSON.parse(savedDateControl));
    }

    let newDateValue = new Date().toISOString().split("T")[0];
    if (savedDateValue !== null) {
      const parsedDateValue = JSON.parse(savedDateValue);
      newDateValue =
        typeof parsedDateValue === "string" &&
        parsedDateValue.match(/^\d{4}-\d{2}-\d{2}$/)
          ? parsedDateValue
          : newDateValue;
    }
    setDateValue(newDateValue);

    if (savedGetData !== null) {
      setGetData(JSON.parse(savedGetData));
    } else {
      fetchData(newDateValue);
    }
  }, []);

  useEffect(() => {
    localStorage.setItem("dateControl", JSON.stringify(dateControl));
  }, [dateControl]);

  useEffect(() => {
    localStorage.setItem("dateValue", JSON.stringify(dateValue));
  }, [dateValue]);
  useEffect(() => {
    localStorage.setItem("getData", JSON.stringify(getData));
  }, [getData]);

  const handleDateChange = (e) => {
    const selectedDate = e.target.value;
    setDateControl(!dateControl);
    setDateValue(selectedDate);
    fetchData(selectedDate);
  };

  const showDate = () => {
    setDateControl(!dateControl);
  };

  const fetchData = async (date) => {
    const response = await fetch(
      `https://api.nasa.gov/planetary/apod?api_key=b8Op7D5FBhw54eFrdh5DhlrIR5ydUBbfgD6hTWtH&date=${date}`
    );
    const result = await response.json();
    setGetData(result);
    console.log(getData);
    console.log(date);
  };

  return (
    <section className="bg-[#1a1a2e] min-h-screen">
      <div className="pt-24 flex flex-col items-center pr-2 pl-2">
        <h1 className="text-center text-[2.19rem] leading-9 text-[#B0A8FF] font-sans text-lg tracking-wide">
          Щоденний космос
        </h1>
        <p className="text-[#fff] text-center text-xs mt-2 font-bold mb-20">
          Відкрийте для себе красу Всесвіту з щоденними зображеннями від Nasa
        </p>
        <div className="max-w-[800px] w-full border border-white rounded-[6px] p-4 mb-10">
          <div className="flex justify-between items-center h-15">
            <h2 className="text-[#fff] text-lg">Астрономічне зображення дня</h2>
            <div>
              <button
                onClick={showDate}
                className="text-[#fff] cursor-pointer bg-[#3aafa9] hover:border hover:border-white rounded-[6px] w-[140px] h-8 text-center"
              >
                {dateValue}
              </button>
              <input
                value={dateValue}
                max={new Date().toISOString().split("T")[0]}
                type="date"
                onChange={handleDateChange}
                onClick={(event) => event.target.showPicker()}
                className={
                  dateControl
                    ? "text-[#fff] border border-white rounded-[6px] w-[140px] h-8 flex justify-center cursor-pointer"
                    : "hidden"
                }
              />
            </div>
          </div>
          <div className="mt-7">
            {getData && (
              <div className="text-white">
                {getData.media_type === "image" && getData.url && (
                  <div className="relative mt-4 w-full h-[400px] mb-5">
                    <img
                      src={getData.url}
                      alt="Зображення"
                      className="rounded object-cover w-full h-full"
                    />
                  </div>
                )}
                <h3 className="text-lg font-bold mb-3 text-center">
                  {getData.title || "Нема даних"}
                </h3>
                <p>{getData.explanation || "Нема даних"}</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </section>
  );
};

export default Hero;
