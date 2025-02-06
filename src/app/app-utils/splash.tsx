import React from "react";

const Splash: React.FC = () => {
  return (
    <div className="flex h-screen items-center justify-center bg-gray-50 dark:bg-gray-900">
      <div className="max-w-md text-center"></div>
    <div className="mx-auto h-32 w-32">
    <img
      src="./public/images/DUFT.png"
      alt="DUFT Logo"
      className="h-full w-full object-contain"
    />
  </div>
  </div>
  );
};

export default Splash;
