import './App.css';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import { Chat } from './components/Chat/Chat';
import { Home } from './components/Home/Home'

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Home />} />

        <Route path="/chat/:session" element={<Chat />} />
      </Routes>
    </Router>
  );
}

export default App;
