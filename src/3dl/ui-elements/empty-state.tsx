const EmptyState: React.FC = () => (
  <div className="mt-4 flex h-1/4 flex-col items-center justify-center rounded-lg bg-gray-100 p-4 text-center">
    <h2 className="text-2xl font-bold text-gray-700">No Data Available</h2>
    <p className="mt-2 text-gray-500">
      Please check back later or adjust your filters.
    </p>
  </div>
);

export default EmptyState;
