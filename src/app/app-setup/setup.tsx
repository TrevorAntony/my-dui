import React from "react";
import SetupWizard from "./setup-wizard";
import { Card } from "flowbite-react";

const Setup: React.FC = () => {
  return (
    <div className="flex min-h-screen items-center justify-center bg-gray-50 dark:bg-gray-900">
      <div className="w-full max-w-7xl px-4 py-8">
        <Card className="overflow-hidden">
          <div className="mb-8 text-center">
            <img
              src="./public/images/DUFT.png"
              alt="DUFT Logo"
              className="mx-auto mb-6 h-16 w-16"
            />
            <h1 className="mb-2 text-3xl font-bold text-gray-900 dark:text-white">
              DUFT SETUP WIZARD 🚀
            </h1>
            <p className="text-gray-600 dark:text-gray-400">
              Let's set up your connections to get started.
            </p>
          </div>
          <SetupWizard />
        </Card>
      </div>
    </div>
  );
};

export default Setup;
