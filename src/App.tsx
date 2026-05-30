import { useEffect, useRef } from 'react'
import { BrowserRouter, Routes, Route, useLocation, useParams } from 'react-router-dom'
import './index.css'
import { AuthProvider, useAuth } from './context/AuthContext'
import { ChatbotCoachProvider } from './context/ChatbotCoachContext'
import { StreakProvider } from './context/StreakContext'
import { HeaderProvider } from './components/Header/HeaderContext'
import Header from './components/Header/Header'
import BottomNav from './components/BottomNav/BottomNav'

import LoginFlow from './pages/Login/LoginFlow'
import LandingPage from './pages/Landing/LandingPage'

import HomePage from './pages/Home/HomePage'
import RecommendPage from './pages/Recommend/RecommendPage'
import RecommendGuestPage from './pages/Recommend/RecommendGuestPage'
import RecommendDetailPage from './pages/Recommend/RecommendDetailPage'
import ChatbotInitPage from './pages/Chatbot/ChatbotInitPage'
import ChatbotPage from './pages/Chatbot/ChatbotPage'
import ChatbotGuestPage from './pages/Chatbot/ChatbotGuestPage'
import PolicyPage from './pages/Policy/PolicyPage'
import PolicyGuestPage from './pages/Policy/PolicyGuestPage'
import PolicyDetailPage from './pages/Policy/PolicyDetailPage'
import MyPage from './pages/MyPage/MyPage'
import MyPageGuest from './pages/MyPage/MyPageGuest'
import ProfileEditPage from './pages/MyPage/ProfileEditPage'
import AiBenefitsPage from './pages/AiBenefits/AiBenefitsPage'
import AiBenefitDetailPage from './pages/AiBenefits/AiBenefitDetailPage'
import BenefitChatPage from './pages/AiBenefits/BenefitChatPage'
import NoticePage from './pages/Notice/NoticePage'

function BenefitChatRoute() {
  const { id } = useParams()
  return <BenefitChatPage key={id} />
}

function AppShell() {
  const { isLoggedIn } = useAuth()
  const location = useLocation()
  const pageContentRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    pageContentRef.current?.scrollTo({ top: 0, left: 0 })
  }, [location.pathname])

  return (
    <div className="app-frame">
      <Header />
      <div className="page-content" ref={pageContentRef}>
        <Routes>
          <Route path="/login" element={<LoginFlow />} />

          <Route path="/"            element={isLoggedIn ? <HomePage />       : <LandingPage />} />
          <Route path="/recommend"   element={isLoggedIn ? <RecommendPage />  : <RecommendGuestPage />} />
          <Route path="/recommend/:id" element={isLoggedIn ? <RecommendDetailPage /> : <RecommendGuestPage />} />
          <Route path="/chatbot/init" element={isLoggedIn ? <ChatbotInitPage /> : <ChatbotGuestPage />} />
          <Route path="/chatbot"     element={isLoggedIn ? <ChatbotPage />    : <ChatbotGuestPage />} />
          <Route path="/policy"      element={isLoggedIn ? <PolicyPage />     : <PolicyGuestPage />} />
          <Route path="/policy/:id"  element={isLoggedIn ? <PolicyDetailPage /> : <PolicyGuestPage />} />
          <Route path="/mypage"      element={isLoggedIn ? <MyPage />         : <MyPageGuest />} />
          <Route path="/mypage/edit" element={isLoggedIn ? <ProfileEditPage /> : <MyPageGuest />} />
          <Route path="/notice"      element={isLoggedIn ? <NoticePage />     : <MyPageGuest />} />
          <Route path="/ai-benefits"          element={isLoggedIn ? <AiBenefitsPage />      : <MyPageGuest />} />
          <Route path="/ai-benefits/:id"      element={isLoggedIn ? <AiBenefitDetailPage /> : <MyPageGuest />} />
          <Route path="/ai-benefits/:id/chat" element={isLoggedIn ? <BenefitChatRoute />    : <MyPageGuest />} />
        </Routes>
      </div>
      <BottomNav />
    </div>
  )
}

export default function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <StreakProvider>
          <ChatbotCoachProvider>
            <HeaderProvider>
              <AppShell />
            </HeaderProvider>
          </ChatbotCoachProvider>
        </StreakProvider>
      </AuthProvider>
    </BrowserRouter>
  )
}
