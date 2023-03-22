import { useParams } from 'react-router-dom';

export function Chat() {
  const { session } = useParams<{ session: string }>();
  return <div>Session {session}</div>;
}