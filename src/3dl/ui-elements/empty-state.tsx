import PropTypes from "prop-types";
import { FiDatabase } from "react-icons/fi";

const EmptyState: React.FC<{ message?: string }> = ({
  message = "Please check back later or adjust your filters.",
}) => (
  <div className="flex h-full w-full items-center justify-center">
    {" "}
    <div className="flex w-full max-w-md flex-col items-center justify-center rounded-lg bg-gradient-to-b from-gray-50 to-gray-100 p-8 text-center shadow-sm transition-all duration-300 hover:shadow-md">
      {" "}
      <div className="mb-4 rounded-full bg-gray-100 p-4 shadow-inner">
        <FiDatabase className="h-8 w-8 animate-pulse text-gray-400" />
      </div>
      <h2 className="bg-gradient-to-r from-gray-700 to-gray-900 bg-clip-text text-2xl font-bold text-transparent">
        No Data Available
      </h2>
      <p className="mt-3 max-w-sm leading-relaxed text-gray-500">{message}</p>
      <div className="mt-4 h-1 w-16 rounded-full bg-gradient-to-r from-gray-200 to-gray-300" />
    </div>
  </div>
);

EmptyState.propTypes = {
  message: PropTypes.string,
};

export default EmptyState;
