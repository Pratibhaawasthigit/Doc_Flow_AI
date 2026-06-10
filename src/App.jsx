import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { useEffect } from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import Dashboard from "./pages/Dashboard";
import Home from "./pages/home";
import EducationHub from "./pages/EducationHub";
import Platform from "./pages/platform";
import Courses from "./pages/Courses";

import Notes from "./pages/Notes";
import Login from "./pages/Login";
import Workspace from "./pages/workspace";
import DocflowAiEngin from "./pages/DocflowAiEngin";
import DocflowLearn from "./pages/DocflowLearn";
import DocflowCore from "./pages/DocflowCore";
import CourseDetails from "./pages/CourseDetails";
import AIEnginePage from "./pages/workspace/AIEnginePage";
import Settings from "./pages/Settings";
import HelpCenter from "./pages/HelpCenter";
import PrivacyPolicy from "./pages/PrivacyPolicy";
import TermsOfService from "./pages/TermsOfService";
import WorkspaceLayout from "./layouts/WorkspaceLayout";
import EducationLayout from "./layouts/EducationLayout";

export default function App() {
  useEffect(() => {
    const savedTheme = localStorage.getItem('theme') || 'light';
    document.documentElement.setAttribute('data-theme', savedTheme);
  }, []);

  return (
    <Router>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/privacy-policy" element={<PrivacyPolicy />} />
        <Route path="/terms-of-service" element={<TermsOfService />} />

        <Route path="/platform" element={<Platform />} />
        <Route path="/login" element={<Login />} />
        
        {/* Education Ecosystem */}
        <Route element={<EducationLayout />}>
          <Route path="/courses" element={<Courses />} />
          <Route path="/education-hub" element={<EducationHub />} />
          <Route path="/notes" element={<Notes />} />
          <Route path="/settings" element={<Settings />} />
        </Route>

        {/* Workspace Ecosystem */}
        <Route element={<WorkspaceLayout />}>
          <Route path="/workspace" element={<Workspace />} />
          <Route path="/ai-engine" element={<DocflowAiEngin />} />
          <Route path="/workspace/ai-engine" element={<AIEnginePage />} />
          <Route path="/docflow-core" element={<DocflowCore />} />
          <Route path="/docflow-learn" element={<DocflowLearn />} />
          <Route path="/help" element={<HelpCenter />} />
        </Route>
      </Routes>
    </Router>
  );
}
