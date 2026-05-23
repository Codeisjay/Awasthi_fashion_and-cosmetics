import React, { useState, useEffect } from 'react';

const CountdownTimer = ({ endDate, offerTitle, compact = false }) => {
  const [timeLeft, setTimeLeft] = useState({
    days: 0,
    hours: 0,
    minutes: 0,
    seconds: 0,
    expired: false
  });

  useEffect(() => {
    const calculateTimeLeft = () => {
      const now = new Date();
      const end = new Date(endDate);
      const difference = end - now;

      if (difference > 0) {
        setTimeLeft({
          days: Math.floor(difference / (1000 * 60 * 60 * 24)),
          hours: Math.floor((difference / (1000 * 60 * 60)) % 24),
          minutes: Math.floor((difference / 1000 / 60) % 60),
          seconds: Math.floor((difference / 1000) % 60),
          expired: false
        });
      } else {
        setTimeLeft({
          days: 0,
          hours: 0,
          minutes: 0,
          seconds: 0,
          expired: true
        });
      }
    };

    calculateTimeLeft();
    const timer = setInterval(calculateTimeLeft, 1000);

    return () => clearInterval(timer);
  }, [endDate]);

  if (timeLeft.expired) {
    return (
      <div className="text-red-600 font-semibold text-sm">
        Offer Expired
      </div>
    );
  }

  if (compact) {
    return (
      <div className="flex items-center gap-2 text-xs font-semibold">
        <span className="text-red-600">⏰</span>
        <span className="text-red-600">
          {timeLeft.hours}h {timeLeft.minutes}m {timeLeft.seconds}s
        </span>
      </div>
    );
  }

  return (
    <div className="bg-gradient-to-r from-red-500 to-orange-500 text-white p-4 rounded-lg text-center">
      <p className="text-sm font-semibold mb-2">{offerTitle}</p>
      <div className="flex justify-center gap-3 text-center">
        <div>
          <div className="text-2xl font-bold">{timeLeft.days}</div>
          <div className="text-xs">Days</div>
        </div>
        <div className="text-2xl">:</div>
        <div>
          <div className="text-2xl font-bold">{timeLeft.hours}</div>
          <div className="text-xs">Hours</div>
        </div>
        <div className="text-2xl">:</div>
        <div>
          <div className="text-2xl font-bold">{timeLeft.minutes}</div>
          <div className="text-xs">Mins</div>
        </div>
        <div className="text-2xl">:</div>
        <div>
          <div className="text-2xl font-bold">{timeLeft.seconds}</div>
          <div className="text-xs">Secs</div>
        </div>
      </div>
    </div>
  );
};

export default CountdownTimer;
