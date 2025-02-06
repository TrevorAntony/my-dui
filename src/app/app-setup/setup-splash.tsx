import React from "react";

const SetupSplash: React.FC = () => {
  return (
    <div className="flex h-screen items-center justify-center bg-gray-50 dark:bg-gray-900">
      <div className="max-w-md text-center">
        <h1 className="mb-4 text-2xl font-semibold text-gray-900 dark:text-white">
          WELCOME TO DUFT
        </h1>
        <div className="mx-auto h-32 w-32">
          <img
            src="./public/images/DUFT.png"
            alt="DUFT Logo"
            className="h-full w-full object-contain"
          />
        </div>
        <p className="mt-4 text-lg text-gray-900 dark:text-gray-400">
          Configuring setup
          <span className="dots-animation">...</span>
        </p>
        <style>{`
          .dots-animation {
            display: inline-block;
            animation: dotsAnimation 1.5s infinite;
            letter-spacing: 2px;
          }

          @keyframes dotsAnimation {
            0% { opacity: .2; }
            20% { opacity: 1; }
            100% { opacity: .2; }
          }
        `}</style>
      </div>
    </div>
  );
};

export default SetupSplash;
