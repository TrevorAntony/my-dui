import React, { FC, ReactNode } from "react";
import { NavLink } from "react-router-dom";

type MoreInfoProps = {
  text: string;
  link: string;
};

type CardComponentProps = {
  header: string;
  subHeader: string;
  children: ReactNode;
  footer?: ReactNode;
  moreInfo?: MoreInfoProps;
  className?: string; // Optional className to override styles
};

const CardComponent: FC<CardComponentProps> = ({
  header,
  subHeader,
  children,
  footer,
  moreInfo,
  className = "",
}) => {
  return (
    <div
      className={`flex flex-col justify-between h-full rounded-lg bg-white p-4 shadow dark:bg-gray-800 sm:p-6 xl:p-8 ${className}`}
    >
      <div>
        <div className="mb-4">
          <div className="shrink-0">
            <h3 className="mb-2 text-xl font-bold text-gray-900 dark:text-white">
              {header}
            </h3>
            <span className="text-base font-normal text-gray-600 dark:text-gray-400">
              {subHeader}
            </span>
          </div>
        </div>
        <div>{children}</div>
      </div>
      {footer && (
        <div className="mt-5 flex items-center justify-between border-t border-gray-200 pt-3 dark:border-gray-700 sm:pt-6">
          {footer}
          {moreInfo && (
            <div className="shrink-0">
              <NavLink
                to={moreInfo.link}
                className="inline-flex items-center rounded-lg p-2 text-xs font-medium uppercase text-primary-700 hover:bg-gray-100 dark:text-primary-500 dark:hover:bg-gray-700 sm:text-sm"
              >
                {moreInfo.text}
                <svg
                  className="ml-1 h-4 w-4 sm:h-5 sm:w-5"
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
    </div>
  );
};

export default CardComponent;
