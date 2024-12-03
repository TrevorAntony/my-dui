import { useDataContext } from "../context/DataContext";

type DataItem = {
  category?: string;
  value?: number;
  [key: string]: unknown;
};

const Tile = ({ label }: { label?: string }) => {
  const { data } = useDataContext();

  return (
    <div style={styles.tileContainer as React.CSSProperties}>
      <div style={styles.label}>{label}</div>
      <div style={styles.value}>{(data as DataItem[])[0].value}</div>
    </div>
  );
};

const styles = {
  tileContainer: {
    border: "2px solid #FF00FF",
    borderRadius: "8px",
    padding: "10px 20px",
    backgroundColor: "#FFF0F5",
    boxShadow: "0px 4px 8px rgba(0, 0, 0, 0.1)",
    textAlign: "center",
    margin: "10px",
    maxWidth: "200px",
  },
  label: {
    fontSize: "14px",
    color: "#800080",
    marginBottom: "5px",
  },
  value: {
    fontSize: "18px",
    fontWeight: "bold",
    color: "#FF00FF",
  },
};

export default Tile;
