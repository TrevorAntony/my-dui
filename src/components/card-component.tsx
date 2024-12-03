import type { FC, ReactNode } from "react";
import { useState } from "react";
import { NavLink } from "react-router-dom";
import { Dataset, ExportData } from "../3dl";
import useDuftQuery from "../3dlcomponents/resources/useDuftQuery";
import { useLayout } from "../3dl/ui-elements/single-layout";
import type { DetailsComponentRegistry } from "./details-component-registry";
import { getDetailsComponent } from "./details-component-registry";
import { HiOutlineExternalLink } from "react-icons/hi";
import { Button, Modal } from "flowbite-react";

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
  detailsComponent?: string;
  resize?: string;
  infoTagContent?: ReactNode;
};

const CardComponent: FC<CardComponentProps> = ({
  header = "",
  subHeader = "",
  children,
  footer,
  moreInfo,
  className = "",
  variant = "card",
  exportData = "false",
  query,
  detailsComponent,
  infoTagContent,
}) => {
  const layout = useLayout();
  const shouldExportData = exportData === "true";
  const isFullHeight = layout === "single-layout";

  const [isModalOpen, setIsModalOpen] = useState(false);
  const detailsComponentKey =
    detailsComponent as keyof DetailsComponentRegistry;
  const DetailsComponent = detailsComponent
    ? getDetailsComponent(detailsComponentKey)
    : undefined;

  const toggleModal = () => setIsModalOpen(!isModalOpen);

  const renderContent = () => (
    <>
      {variant !== "plain" && (header || subHeader) && (
        <div className="mb-3 flex items-start justify-between">
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
          <div className="flex items-center space-x-2">
            {infoTagContent ? infoTagContent : null}
            {shouldExportData && layout !== "single-layout" && (
              <div className="self-start pl-1">
                {query ? (
                  <Dataset query={query} useQuery={useDuftQuery}>
                    <ExportData />
                  </Dataset>
                ) : (
                  <ExportData />
                )}
              </div>
            )}
            {DetailsComponent && (
              <button
                className="pl-1 pt-[1.85px] dark:text-highlight-500"
                onClick={toggleModal}
                title="Show Details"
              >
                <HiOutlineExternalLink
                  className=" text-gray-400 hover:text-gray-600"
                  size={20}
                />
              </button>
            )}
          </div>
        </div>
      )}

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

  return (
    <>
      {variant === "card" ? (
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
      )}

      {DetailsComponent && (
        <Modal
          show={isModalOpen}
          onClose={() => toggleModal()}
          position="center"
          size="5xl"
        >
          <Modal.Header>{header}</Modal.Header>
          <Modal.Body className="flex flex-col overflow-hidden ">
            <DetailsComponent
              container={
                detailsComponent === "infinite-scroll-table"
                  ? CardComponent
                  : null
              }
              variant={
                detailsComponent === "infinite-scroll-table" ? "plain" : variant
              }
            />
          </Modal.Body>
          <Modal.Footer>
            <div className="flex w-full justify-end">
              <Button onClick={() => toggleModal()} color="primary">
                Close
              </Button>
            </div>
          </Modal.Footer>
        </Modal>
      )}
    </>
  );
};

export default CardComponent;
