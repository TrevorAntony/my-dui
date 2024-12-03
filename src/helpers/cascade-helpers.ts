import config from "../config";

async function fetchCascade(
  query: string,
  filters: Record<string, string> = {}
) {
  let modifiedQuery = query;

  const placeholders = query.match(/\$[a-zA-Z_]+/g) || [];
  placeholders.forEach((placeholder: string) => {
    const filterKey = placeholder.substring(1);
    const filterValue = filters[filterKey] || "";
    modifiedQuery = modifiedQuery.replace(placeholder, filterValue);
  });

  const payload = {
    query: modifiedQuery,
    data_connection_id: config.dataConnection,
  };

  try {
    const response = await fetch(`${config.apiBaseUrl}/run-query`, {
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
          modifiedQuery
      );
    }

    return result;
  } catch (error) {
    throw new Error("Error fetching data: " + (error as Error).message);
  }
}

export default fetchCascade;
