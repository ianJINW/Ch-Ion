import './App.css'
import { FormAuth } from './pages/formAuth';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import ChatPage from './pages/chat';
import NavBar from './components/Navbar';
import Home from './pages/Home';
import Chats from './pages/chats';
import useAuthSync from './hooks/useAuth';
import useChatStore from './store/chat.store';
import { useEffect } from 'react';

function App() {
  useAuthSync()

  const connect = useChatStore(s => s.connect)

  useEffect(() => {
    connect()
  }, [connect])

  return (
    <>
      <Router>
        <div className="bg-neutral-950 text-white">
          <NavBar />
          <Routes>
            <Route path='/chat' element={<Chats />} />
            <Route path='/chat/:id' element={<ChatPage />} />
            <Route path='/auth' element={<FormAuth />} />
            <Route path="/" element={<Home />} />
          </Routes>
        </div>
      </Router>
    </>
  )
}

export default App
