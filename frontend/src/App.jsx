import React, { useState, useMemo } from 'react';
import { BrowserRouter as Router, Routes, Route, useParams } from 'react-router-dom';
import { ThemeProvider, createTheme, CssBaseline } from '@mui/material';

import LoginPage from './modules/auth/LoginPage';
import RegisterPage from './modules/auth/RegisterPage';
import CommunitiesHomePage from './modules/community/CommunitiesHomePage.jsx';
import CommunityDetail from './modules/community/CommunityDetail';
import CommunityCategoryPage from './modules/community/CommunityCategoryPage.jsx';
import FoodRescuePage from './modules/food/FoodRescuePage';
import Navbar from './shared/components/Navbar';
import Footer from './shared/components/Footer';
import CreateCommunityForm from './modules/community/components/CreateCommunityForm.jsx';
import SettingsPage from './modules/auth/SettingsPage';
import UserProfilePage from './modules/user/UserProfilePage';
import ChatPage from './modules/chat/ChatPage';
import EditProfilePage from './modules/user/EditProfilePage';

import CommunitySettings from './modules/community/CommunitySettings';
import CommunityMembersPage from './modules/community/CommunityMembersPage';

const App = () => {
  const [isLoggedIn, setIsLoggedIn] = useState(true);
  const [isDarkMode, setIsDarkMode] = useState(false);

  const handleLogout = () => {
    setIsLoggedIn(false);
    localStorage.removeItem('token');
    localStorage.removeItem('userId');
  };

  const toggleTheme = () => setIsDarkMode((prev) => !prev);

  const theme = useMemo(
    () =>
      createTheme({
        palette: {
          mode: isDarkMode ? 'dark' : 'light',
        },
      }),
    [isDarkMode]
  );

  const CommunityDetailWithParams = () => {
    const { id } = useParams();
    return <CommunityDetail communityId={id} />;
  };

  const UserProfileWithParams = () => {
    const { userId } = useParams();
    return <UserProfilePage userId={userId} />;
  };

  const ChatPageWithParams = () => {
    const { recipientId } = useParams();
    return <ChatPage recipientId={recipientId} />;
  };

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <Router>
        <Navbar isLoggedIn={isLoggedIn} onLogout={handleLogout} />
        <Routes>
          <Route path="/login" element={<LoginPage />} />
          <Route path="/register" element={<RegisterPage />} />
          <Route path="/communities" element={<CommunitiesHomePage />} />
          <Route path="/communities/category/:categoryName" element={<CommunityCategoryPage />} />
          <Route path="/communities/:id" element={<CommunityDetailWithParams />} />
          <Route path="/communities/create" element={<CreateCommunityForm />} />
          <Route path="/food" element={<FoodRescuePage />} />
          <Route
            path="/settings"
            element={
              <SettingsPage
                onLogout={handleLogout}
                onThemeToggle={toggleTheme}
                isDarkMode={isDarkMode}
              />
            }
          />
          <Route path="/settings/edit-profile" element={<EditProfilePage />} />
          <Route path="/users/:userId" element={<UserProfileWithParams />} />
          <Route path="/chat/:recipientId" element={<ChatPageWithParams />} />
          {/* Community management routes */}
          <Route path="/communities/:id/settings" element={<CommunitySettings />} />
          <Route path="/communities/:id/members" element={<CommunityMembersPage />} />
        </Routes>
        <Footer />
      </Router>
    </ThemeProvider>
  );
};

export default App;
