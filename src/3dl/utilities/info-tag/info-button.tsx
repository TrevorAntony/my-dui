function InfoButton() {
  return (
    <div className="h-[20px] w-[20px]">
      <svg
        className="h-7 w-7 text-gray-400 hover:text-gray-600 dark:text-white"
        aria-hidden="true"
        xmlns="http://www.w3.org/2000/svg"
        width="20"
        height="20"
        fill="none"
        viewBox="0 0 24 24"
      >
        {/* SVG path for info icon */}
        <path
          stroke="currentColor"
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth="2"
          d="M12 2a10 10 0 1 1-10 10A10 10 0 0 1 12 2zm.75 13h-1.5v-1.5h1.5V15zm0-3h-1.5V7h1.5v5z"
        />
      </svg>
    </div>
  );
}

export default InfoButton;
