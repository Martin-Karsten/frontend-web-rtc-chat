import { useState, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { SessionResponse } from '../types/SessionResponse';

function useApi(): [SessionResponse | null, boolean, Error | null, () => Promise<void>] {
  const [data, setData] = useState<SessionResponse | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);
  const navigate = useNavigate();

  const fetchData = useCallback(async (): Promise<void> => {
    setIsLoading(true);

    try {
      const response = await fetch(`http://localhost:8080/api/chat/start`);

      if (!response.ok) {
        throw new Error(`Failed to fetch data: ${response.statusText}`);
      }

      const data: SessionResponse = await response.json();
      setData(data);
      navigate(`/chat/${data.sessionId}`);
    } catch (error: unknown) {
      setError(error as Error);
    } finally {
      setIsLoading(false);
    }
  }, []);

  return [data, isLoading, error, fetchData];
}

export default useApi;
