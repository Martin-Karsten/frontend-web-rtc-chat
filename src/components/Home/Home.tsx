import useApi from '../../hooks/useSession';

export function Home() {
  const [data, isLoading, error, fetchData] = useApi();

  return (
    <div>
      <button onClick={fetchData}>Create Chat room</button>
    </div>
  );
}