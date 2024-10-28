import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Login from './components/Login';
import VoterRegistration from './components/VoterRegistration';
import Elections from './components/Elections/Elections';
import HomePage from './components/HomePage';
import Voting from './components/Elections/Voting';
import Admin from './components/Admin/AdminDashboard';
import CreateElection from './components/Admin/CreateElection';
import ElectionResults from './components/Admin/ElectionResults';
import ElectionDetails from './components/Admin/ElectionDetails';
import PrivateRoute from './components/PrivateRoute';

const App = () => {
  return (
    <Router>
      <Routes>
        {/* Home Page Route */}
        <Route path="/" element={<HomePage />} />

        {/* Public Routes */}
        <Route path="/elections" element={<Elections />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<VoterRegistration />} />

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
          path="/admin/elections/votes/results/:electionID" // Updated to include the electionID parameter
          element={<PrivateRoute element={<ElectionResults />} allowedRoles={['admin']} />} 
        />
        <Route 
          path="/admin/elections/:id" 
          element={<PrivateRoute element={<ElectionDetails />} allowedRoles={['admin']} />} 
        />

        {/* Election Detail Route */}
        <Route path="/elections/:id" element={<Voting />} />
      </Routes>
    </Router>
  );
};

export default App;
