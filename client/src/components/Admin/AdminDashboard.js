import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faEye } from '@fortawesome/free-solid-svg-icons';
import '../Styles/AdminDashboard.css';

const AdminDashboard = () => {
  const [currentElections, setCurrentElections] = useState([]);
  const [previousElections, setPreviousElections] = useState([]);
  const [errorMessage, setErrorMessage] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (!token) {
      navigate('/login');
      return;
    }

    const fetchElections = async () => {
      setLoading(true);
      try {
        const response = await axios.get('http://localhost:3500/elections', {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        const currentDate = new Date();
        const current = response.data.filter(
          (election) => new Date(election.endDate) >= currentDate
        );
        const previous = response.data.filter(
          (election) => new Date(election.endDate) < currentDate
        );

        setCurrentElections(current);
        setPreviousElections(previous);
      } catch (err) {
        setErrorMessage('Failed to fetch elections.');
      } finally {
        setLoading(false);
      }
    };

    fetchElections();
  }, [navigate]);

  const handleCreateElection = () => {
    navigate('/admin/create');
  };

  const handleViewUsers = () => {
    navigate('/admin/get-users');
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
      
      <div className="dashboard-buttons">
        <button onClick={handleCreateElection} className="create-election-button">
          Create New Election
        </button>
        <button onClick={handleViewUsers} className="view-users-button">
          View Users
        </button>
      </div>

      {loading ? (
        <p>Loading elections...</p>
      ) : (
        <>
          <section>
            <h3>Current Elections</h3>
            {currentElections.length > 0 ? (
              <ul className="elections-list">
                {currentElections.map((election) => (
                  <li key={election._id} className="election-item">
                    <div className="election-info">
                      <FontAwesomeIcon
                        icon={faEye}
                        className="election-icon"
                        onClick={() => handleElectionClick(election._id)}
                      />
                      <span
                        className="election-title"
                        onClick={() => handleElectionClick(election._id)}
                      >
                        {election.title}
                      </span>
                      <span className="election-end-date">
                        End Date: {new Date(election.endDate).toLocaleDateString()}
                      </span>
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
            ) : (
              <p>No current elections available.</p>
            )}
          </section>

          <section>
            <h3>Previous Elections</h3>
            {previousElections.length > 0 ? (
              <ul className="elections-list">
                {previousElections.map((election) => (
                  <li key={election._id} className="election-item">
                    <div className="election-info">
                      <FontAwesomeIcon
                        icon={faEye}
                        className="election-icon"
                        onClick={() => handleElectionClick(election._id)}
                      />
                      <span
                        className="election-title"
                        onClick={() => handleElectionClick(election._id)}
                      >
                        {election.title}
                      </span>
                      <span className="election-end-date">
                        End Date: {new Date(election.endDate).toLocaleDateString()}
                      </span>
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
            ) : (
              <p>No previous elections available.</p>
            )}
          </section>
        </>
      )}
    </div>
  );
};

export default AdminDashboard;
