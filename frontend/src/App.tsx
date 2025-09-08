import "./App.css";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import SignupForm from "./component/SignupForm";
import CompanyForm from "./component/CompanyForm";
import CompanyDashboard from "./component/CompanyDashboard";
import JobPosts from "./component/JobPosts";
import Profile from "./component/Profile";
import Analytics from "./component/Analytics";
import Settings from "./component/Settings";
import JobDetail from "./component/JobDetail"; // Company side job detail
import LoginCompany from "./component/LoginCompany";
import UserPage from "./component/UserPage";
import UserLayout from "./component/UserLayout";
import UserProfile from "./component/UserProfile";
import UserLogin from "./component/UserLogin";
import JobsPage from "./component/JobsPage";
import UserJobDetails from "./component/UserJobDetails";
import UserProfilePage from "./component/UserProfilePage";
import VerifyOtp from "./component/OtpVerification";
import AiMockInterviewQuestion from "./component/AiMockInterviewQuestion";
import AIMockInterview from "./component/AiMockInterview";
import Aboutus from "./component/Aboutus";
import NotFoundPage from "./component/NotFoundPage";
import Pricing from "./component/Pricing";
import Ranking from "./component/Ranking";
import RoleJetPreparationCenter from "./component/Preparation";

function App() {
  return (
    <Router>
      <Routes>
        {/* Public routes (no navbar) */}
        <Route path="/" element={<SignupForm />} />
        <Route path="/company" element={<CompanyForm />} />
        <Route path="/loginCompany" element={<LoginCompany />} />
        <Route path="/userProfile" element={<UserProfile />} />
        <Route path="/userLogin" element={<UserLogin />} />
        <Route path="/verifyOtp" element={<VerifyOtp />} />
        {/* Company Dashboard (no navbar) */}
        <Route path="/companyDashboard" element={<CompanyDashboard />}>
          <Route index element={<JobPosts />} />
          <Route path="jobpost" element={<JobPosts />} />
          <Route path="profile" element={<Profile />} />
          <Route path="jobDetail/:id" element={<JobDetail />} />{" "}
          {/* ✅ company detail */}
          <Route path="analytics" element={<Analytics />} />
          <Route path="pricing" element={<Pricing />} />
          <Route path="settings" element={<Settings />} />
          <Route path="ranking" element={<Ranking />} />
        </Route>

        {/* User Dashboard (with navbar via UserLayout) */}
        <Route path="/user" element={<UserLayout />}>
          <Route index element={<UserPage />} />
          <Route path="userHome" element={<UserPage />} />

          <Route path="jobs" element={<JobsPage />} />
          <Route path="view/:id" element={<UserJobDetails />} />
          <Route path="profilePage" element={<UserProfilePage />} />
          <Route path="interviewAsk" element={<AiMockInterviewQuestion />} />
          <Route path="about" element={<Aboutus />} />
          <Route path="interview" element={<AIMockInterview />} />
          <Route path="preparation" element={<RoleJetPreparationCenter />} />
        </Route>
        <Route path="*" element={<NotFoundPage />} />
      </Routes>
    </Router>
  );
}

export default App;
