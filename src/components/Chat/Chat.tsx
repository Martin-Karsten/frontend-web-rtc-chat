import { useParams } from 'react-router-dom';

function Chat() {
  const { sessionId } = useParams<{ sessionId: string }>();
  // Do something with the `pin` value
  return <div>sessionId {sessionId}</div>;
}