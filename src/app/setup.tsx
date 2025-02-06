import React from "react";
import SetupForm from "./components/setup-form";

const Setup: React.FC = () => {
  return (
    <div className="flex h-screen bg-gray-50">
      <div className="mx-auto my-8 w-full max-w-4xl rounded-lg bg-white p-8 shadow-lg">
        <h1 className="mb-6 text-2xl font-bold">Welcome to DUFT</h1>
        <p className="mb-8 text-gray-600">
          Let's set up your connections to get started.
        </p>
        <SetupForm />
      </div>
    </div>
  );
};

export default Setup;
