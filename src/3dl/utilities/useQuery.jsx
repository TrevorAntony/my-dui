import { useState, useEffect } from 'react';

const useQuery = (query) => {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);

        // Prepare the payload
        const payload = {
          query,
          data_connection_id: 'ANA', // Hardcoded data connection ID
        };

        // Make the API request
        const response = await fetch('http://localhost:8000/api/v2/query-engine', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(payload),
        });

        const result = await response.json();

        if (!response.ok) {
          throw new Error('Network response was not ok: ' + result.message + "\n" + "Original query: " + query);
        }


        setData(result); // Assuming the data is an array of options
      } catch (error) {
        setError(error);
      } finally {
        setLoading(false);
      }
    };

    if (query) {
      fetchData();
    } else {
      setLoading(false);
    }
  }, [query]);

  return { data, loading, error };
};

export default useQuery;