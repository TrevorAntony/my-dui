import React from "react";
import type { FallbackProps } from "react-error-boundary";
import CardComponent from "../components/card-component";

const ErrorFallback: React.FC<FallbackProps> = ({ error }) => {
  console.error("Fallback Error: ", error.message);

  return (
    <CardComponent header="" subHeader="" variant="card">
      <section className="flex items-center justify-center bg-white dark:bg-gray-900">
        <div className="mx-auto max-w-screen-lg px-6 py-8 text-center">
          <div className="flex flex-col items-center">
            <h1 className="mb-6 text-3xl font-extrabold text-gray-400 md:text-5xl">
              Oops!
            </h1>
            <p className="mb-8 max-w-md text-sm text-gray-500 dark:text-gray-400 md:max-w-lg md:text-base lg:text-lg">
              We're sorry, something went wrong while loading the content.
              Please check back later.
            </p>
          </div>
        </div>
      </section>
    </CardComponent>
  );
};

export default ErrorFallback;
