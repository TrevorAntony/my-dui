import type { FC, ReactNode } from "react";
import { NavLink } from "react-router-dom";
import { Dataset, ExportData } from "../3dl";
import useDuftQuery from "../3dlcomponents/resources/useDuftQuery";
import { useLayout } from "../3dl/ui-elements/single-layout";

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
  className?: string;
  variant?: "card" | "no-card" | "plain";
  exportData?: string | boolean;
  query?: string;
};

const CardComponent: FC<CardComponentProps> = ({
  header,
  subHeader,
  children,
  footer,
  moreInfo,
  className = "",
  variant = "card",
  exportData = "false",
  query,
}) => {
  const layout = useLayout();
  const shouldExportData = exportData === "true";
  const isFullHeight = layout === "single-layout";

  const renderContent = () => (
    <>
      {variant !== "plain" && (
        <div className="mb-3 flex items-start justify-between">
          {/* Header and subHeader */}
          <div>
            <h3 className="mb-1 text-lg font-semibold text-gray-900 dark:text-white">
              {header}
            </h3>
            {subHeader && (
              <span className="text-sm font-normal text-gray-600 dark:text-gray-400">
                {subHeader}
              </span>
            )}
          </div>
          {/* Conditionally render ExportData, aligned to the top */}
          {shouldExportData && (
            <div className="mt-1 self-start">
              {query ? (
                <Dataset query={query} useQuery={useDuftQuery}>
                  <ExportData />
                </Dataset>
              ) : (
                <ExportData />
              )}
            </div>
          )}
        </div>
      )}
      {/* Ensure the children are centered */}
      <div className="mt-4 grow">{children}</div>
      {footer && variant !== "plain" && (
        <div className="mt-4 flex items-center justify-between border-t border-gray-200 pt-2 dark:border-gray-700 sm:pt-4">
          {footer}
          {moreInfo && (
            <div className="shrink-0">
              <NavLink
                to={moreInfo.link}
                className="inline-flex items-center rounded-md p-1 text-xs font-medium uppercase text-highlight-700 hover:bg-gray-100 dark:text-highlight-500 dark:hover:bg-gray-700 sm:text-sm"
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
      className={`flex flex-col justify-between rounded-lg bg-white p-3 shadow dark:bg-gray-800 sm:p-4 xl:p-5 ${
        isFullHeight ? "mt-4 h-full min-h-screen" : "h-auto"
      } ${className}`}
    >
      {renderContent()}
    </div>
  ) : variant === "no-card" ? (
    <div
      className={`${
        isFullHeight ? "mt-4 h-full min-h-screen" : ""
      } ${className}`}
    >
      {renderContent()}
    </div>
  ) : (
    <>{children}</>
  );
};

export default CardComponent;
