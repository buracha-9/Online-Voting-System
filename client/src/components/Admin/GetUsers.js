import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import '../Styles/GetUsers.css';

const GetUsers = () => {
  const [users, setUsers] = useState([]);
  const [errorMessage, setErrorMessage] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem('token');

    const fetchUsers = async () => {
      setLoading(true);
      setErrorMessage(''); // Clear previous error message
      try {
        const response = await axios.get('http://localhost:3500/register', {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        if (response.data.length > 0) {
          setUsers(response.data);
        } else {
          setErrorMessage('No users found.'); // Message when no users are returned
        }
      } catch (err) {
        setErrorMessage('Unable to fetch user list. Please try again later.'); // Clearer error message
      } finally {
        setLoading(false);
      }
    };

    fetchUsers();
  }, [navigate]);

  return (
    <div className="get-users-container">
      <h2>User List</h2>
      {errorMessage && <p className="error">{errorMessage}</p>}
      {loading ? (
        <p>Loading user list, please wait...</p> // More descriptive loading message
      ) : (
        <ol className="user-list">
          {users.map((user) => (
            <li key={user._id} className="user-item">
              <p><strong>Name:</strong> {`${user.firstname} ${user.lastname}`}</p>
              <p><strong>Email:</strong> {user.email}</p>
            </li>
          ))}
        </ol>
      )}
    </div>
  );
};

export default GetUsers;
