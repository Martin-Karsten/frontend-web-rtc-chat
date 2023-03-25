import './App.css';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import { ChatRoom } from './components/ChatRoom/ChatRoom';
import { Home } from './components/Home/Home';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Home />} />

        <Route path="/chat/:sessionId" element={<ChatRoom />} />
      </Routes>
    </Router>
  );
}

export default App;
