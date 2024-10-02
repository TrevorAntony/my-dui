import React from "react";
import { FallbackProps } from "react-error-boundary";
import CardComponent from "../components/card-component";

const ErrorFallback: React.FC<FallbackProps> = ({ error }) => {
  console.error("Fallback Error: ", error.message);

  return (
    <CardComponent header="" subHeader="" variant="card">
      <section className="bg-white dark:bg-gray-900 flex items-center justify-center">
        <div className="py-8 px-6 mx-auto max-w-screen-lg text-center">
          <div className="flex flex-col items-center">
            <h1 className="mb-6 text-3xl md:text-5xl font-extrabold text-gray-400">
              Oops!
            </h1>
            <p className="mb-8 text-sm md:text-md lg:text-lg text-gray-500 dark:text-gray-400 max-w-md md:max-w-lg">
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
