import type { FC, ReactNode } from "react";
import React from "react";
import { NavLink } from "react-router-dom";

type MoreInfoProps = {
  text: string;
  link: string;
};

type CardComponentProps = {
  header: string;
  subHeader?: string;
  children: ReactNode;
  footer?: ReactNode;
  moreInfo?: MoreInfoProps;
  className?: string; // Optional className to override styles
  variant?: "card" | "no-card" | "plain"; // New variant prop
};

const CardComponent: FC<CardComponentProps> = ({
  header,
  subHeader,
  children,
  footer,
  moreInfo,
  className = "",
  variant = "card", // Default to "card"
}) => {
  const renderContent = () => (
    <>
      {variant !== "plain" && (
        <div className="mb-3">
          <div className="shrink-0">
            <h3 className="mb-1 text-lg font-semibold text-gray-900 dark:text-white">
              {header}
            </h3>
            {subHeader && (
              <span className="text-sm font-normal text-gray-600 dark:text-gray-400">
                {subHeader}
              </span>
            )}
          </div>
        </div>
      )}
      <div>{children}</div>
      {footer && variant !== "plain" && (
        <div className="mt-4 flex items-center justify-between border-t border-gray-200 pt-2 dark:border-gray-700 sm:pt-4">
          {footer}
          {moreInfo && (
            <div className="shrink-0">
              <NavLink
                to={moreInfo.link}
                className="inline-flex items-center rounded-md p-1 text-xs font-medium uppercase text-primary-700 hover:bg-gray-100 dark:text-primary-500 dark:hover:bg-gray-700 sm:text-sm"
              >
                {moreInfo.text}
                <svg
                  className="ml-1 h-4 w-4 sm:h-4 sm:w-4"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M9 5l7 7-7 7"
                  />
                </svg>
              </NavLink>
            </div>
          )}
        </div>
      )}
    </>
  );

  return variant === "card" ? (
    <div
      className={`flex h-auto flex-col justify-between rounded-lg bg-white p-3 shadow dark:bg-gray-800 sm:p-4 xl:p-5 ${className}`}
    >
      {renderContent()}
    </div>
  ) : variant === "no-card" ? (
    <div className={className}>{renderContent()}</div>
  ) : (
    <>{children}</>
  );
};

export default CardComponent;
