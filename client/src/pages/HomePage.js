import React, { useEffect, useState } from 'react';
import ElectionCard from '../components/ElectionCard';
import { getAllElections } from '../services/electionService';

const HomePage = () => {
  const [elections, setElections] = useState([]);

  useEffect(() => {
    // Fetching elections from backend API
    getAllElections()
      .then(response => setElections(response.data))
      .catch(error => console.error('Error fetching elections:', error));
  }, []);

  return (
    <div>
      <h1>Welcome to the Voting Platform</h1>
      <div>
        {elections.map(election => (
          <ElectionCard key={election._id} election={election} />
        ))}
      </div>
    </div>
  );
};

export default HomePage;
