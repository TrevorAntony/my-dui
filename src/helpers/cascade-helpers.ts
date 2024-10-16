async function fetchCascade(query) {
  const payload = {
    query,
    data_connection_id: "ANA",
  };
  try {
    const response = await fetch("http://localhost:8000/api/v2/query-engine", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(payload),
    });
    const result = await response.json();
    if (!response.ok) {
      throw new Error(
        "Network response was not ok: " +
          result.message +
          "\n" +
          "Original query: " +
          query,
      );
    }
    return result;
  } catch (error) {
    throw new Error("Error fetching data: " + error.message);
  }
}

export default fetchCascade;
