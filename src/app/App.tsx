import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import LoginPage from '../pages/LoginPage'
import SignUpPage from '../pages/SignUpPage'
import ChatPage from '../pages/ChatPage'
import JournalPage from '../pages/JournalPage'
import CreateCharacterPage from '../pages/CreateCharacterPage'
import SelectCharacterPage from '../pages/SelectCharacterPage'
import CustomizeCharacterPage from '../pages/CustomizeCharacterPage'
import RandomChatPage from '../pages/RandomChatPage'

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Navigate to="/login" replace />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/signup" element={<SignUpPage />} />
        <Route path="/chat" element={<ChatPage />} />
        <Route path="/journal" element={<JournalPage />} />
        <Route path="/create-character" element={<CreateCharacterPage />} />
        <Route path="/select-character" element={<SelectCharacterPage/>}/>
        <Route path="/customize-character" element={<CustomizeCharacterPage/>}/>
        <Route path="/random-chat" element={<RandomChatPage/>}/>
      </Routes>
    </BrowserRouter>
  )
}

export default App