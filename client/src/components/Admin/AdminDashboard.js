import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faEye } from '@fortawesome/free-solid-svg-icons'; // Import the eye icon

const AdminDashboard = () => {
  const [elections, setElections] = useState([]);
  const [errorMessage, setErrorMessage] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchElections = async () => {
      setLoading(true);
      try {
        const token = localStorage.getItem('token');
        const response = await axios.get('http://localhost:3500/elections', {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        setElections(response.data);
      } catch (err) {
        setErrorMessage('Failed to fetch elections.');
      } finally {
        setLoading(false);
      }
    };
    fetchElections();
  }, []);

  const handleCreateElection = () => {
    navigate('/admin/create');
  };

  const handleElectionClick = (id) => {
    navigate(`/admin/elections/${id}`);
  };

  const handleResultClick = (id) => {
    navigate(`/admin/elections/votes/results/${id}`);
  };

  return (
    <div className="admin-dashboard-container">
      <h2>Admin Dashboard</h2>
      {errorMessage && <p className="error">{errorMessage}</p>}
      <button onClick={handleCreateElection} className="create-election-button">
        Create New Election
      </button>
      {loading ? (
        <p>Loading elections...</p>
      ) : (
        <>
          <div className="elections-header">
            <span className="header-title">Election Title</span>
            <span className="header-end-date">End Date</span>
            <span className="header-icon"></span> {/* Empty space for icon header */}
            <span className="header-result">Results</span> {/* Header for Results button */}
          </div>
          <ul className="elections-list">
            {elections.map((election) => (
              <li key={election._id} className="election-item">
                <div className="election-info">
                  <span 
                    className="election-title" 
                    onClick={() => handleElectionClick(election._id)} 
                    style={{ cursor: 'pointer' }}
                  >
                    {election.title}
                  </span>
                  <span className="election-end-date">
                    {new Date(election.endDate).toLocaleDateString()}
                  </span>
                  <FontAwesomeIcon 
                    icon={faEye} 
                    className="election-icon" 
                    onClick={() => handleElectionClick(election._id)} 
                  />
                  <button 
                    onClick={() => handleResultClick(election._id)} 
                    className="result-button"
                  >
                    View Results
                  </button>
                </div>
              </li>
            ))}
          </ul>
        </>
      )}
    </div>
  );
};

export default AdminDashboard;
