import './App.css'
import { FormAuth } from './pages/formAuth';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import ChatPage from './pages/chat';
import NavBar from './components/Navbar';
import Home from './pages/Home';

function App() {
  return (
    <>
      <Router>
        <div className="min-h-screen bg-neutral-950 text-white">
          <NavBar />
          <Routes>
            <Route path='/chat' element={<ChatPage />} />
            <Route path='/auth' element={<FormAuth />} />
            <Route path="/" element={<Home />} />
          </Routes>
        </div>
      </Router>
    </>
  )
}

export default App
