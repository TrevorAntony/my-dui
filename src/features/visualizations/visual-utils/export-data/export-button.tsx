interface ExportButtonProps {
  onClick: () => void;
}

function ExportButton({ onClick }: ExportButtonProps) {
  return (
    <div className="h-[20px] w-[20px]">
      <button onClick={onClick}>
        <svg
          className="h-7 w-7 text-gray-400 hover:text-gray-600"
          aria-hidden="true"
          xmlns="http://www.w3.org/2000/svg"
          width="20"
          height="20"
          fill="none"
          viewBox="0 0 24 24"
        >
          <path
            stroke="currentColor"
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth="2"
            d="M4 15v2a3 3 0 0 0 3 3h10a3 3 0 0 0 3-3v-2m-8 1V4m0 12-4-4m4 4 4-4"
          />
        </svg>
      </button>
    </div>
  );
}

export default ExportButton;
