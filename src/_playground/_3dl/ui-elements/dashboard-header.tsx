const DashboardHeader = ({ title }: { title: string }) => {
  return (
    <div
      style={{
        padding: "1rem",
        borderBottom: "2px solid #E5E7EB",
        marginBottom: "1rem",
        textAlign: "center",
        fontWeight: "bold",
        fontSize: "1.5rem",
      }}
    >
      {title}
    </div>
  );
};

export default DashboardHeader;
