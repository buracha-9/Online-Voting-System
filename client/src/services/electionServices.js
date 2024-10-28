import axios from 'axios';

export const getAllElections = () => {
  return axios.get('http://localhost:3500/server/routes/api/elections'); // Replace with your backend API URL
};
