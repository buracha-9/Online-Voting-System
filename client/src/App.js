import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Login from './components/Login';
import VoterRegistration from './components/VoterRegistration';
import AboutPage from './components/AboutPage';
import PrivacyPolicy from './components/PrivacyPolicy';
import TermsOfService from './components/TermsOfService';
import Contact from './components/Contact';
import Elections from './components/Elections/Elections';
import HomePage from './components/HomePage';
import Voting from './components/Elections/Voting';
import Admin from './components/Admin/AdminDashboard';
import CreateElection from './components/Admin/CreateElection';
import GetUsers from './components/Admin/GetUsers';
import ElectionResults from './components/Admin/ElectionResults';
import ElectionDetails from './components/Admin/ElectionDetails';
import PrivateRoute from './components/PrivateRoute';
import Header from './components/Header'; // Import Header
import Footer from './components/Footer'; // Import Footer

const App = () => {
  return (
    <Router>
      <Header /> {/* Include Header */}
      <main>
        <Routes>
          {/* Home Page Route */}
          <Route path="/" element={<HomePage />} />

          {/* Public Routes */}
          <Route path="/elections" element={<Elections />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<VoterRegistration />} />
          <Route path="/about" element={<AboutPage />} />
          <Route path="/privacypolicy" element={<PrivacyPolicy />} />
          <Route path="/termsofservice" element={<TermsOfService />} />
          <Route path="/contact" element={<Contact />} />

          {/* Admin Routes */}
          <Route 
            path="/admin" 
            element={<PrivateRoute element={<Admin />} allowedRoles={['admin']} />} 
          />
          <Route 
            path="/admin/create" 
            element={<PrivateRoute element={<CreateElection />} allowedRoles={['admin']} />} 
          />
          <Route 
            path="/admin/get-users" 
            element={<PrivateRoute element={<GetUsers />} allowedRoles={['admin']} />} 
          />
          <Route 
            path="/admin/elections/votes/results/:electionID" 
            element={<PrivateRoute element={<ElectionResults />} allowedRoles={['admin']} />} 
          />
          <Route 
            path="/admin/elections/:id" 
            element={<PrivateRoute element={<ElectionDetails />} allowedRoles={['admin']} />} 
          />

          {/* Election Detail Route */}
          <Route path="/elections/:id" element={<Voting />} />
        </Routes>
      </main>
      <Footer /> {/* Include Footer */}
    </Router>
  );
};

export default App;
