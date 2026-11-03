import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { AppStateProvider } from './context/AppStateContext.jsx';
import AppLayout from './components/layout/AppLayout.jsx';

import LandingPage from './pages/LandingPage.jsx';
import OnboardingPage from './pages/OnboardingPage.jsx';
import MatchesPage from './pages/MatchesPage.jsx';
import JobDetailPage from './pages/JobDetailPage.jsx';
import CreditsPage from './pages/CreditsPage.jsx';
import ApplicationsPage from './pages/ApplicationsPage.jsx';
import SavedJobsPage from './pages/SavedJobsPage.jsx';
import ProfilePage from './pages/ProfilePage.jsx';
import NotFoundPage from './pages/NotFoundPage.jsx';

export default function App() {
  return (
    <AppStateProvider>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<AppLayout />}>
            <Route index element={<LandingPage />} />
            <Route path="start" element={<OnboardingPage />} />
            <Route path="matches" element={<MatchesPage />} />
            <Route path="jobs/:id" element={<JobDetailPage />} />
            <Route path="credits" element={<CreditsPage />} />
            <Route path="applications" element={<ApplicationsPage />} />
            <Route path="saved" element={<SavedJobsPage />} />
            <Route path="profile" element={<ProfilePage />} />
            <Route path="*" element={<NotFoundPage />} />
          </Route>
        </Routes>
      </BrowserRouter>
    </AppStateProvider>
  );
}
