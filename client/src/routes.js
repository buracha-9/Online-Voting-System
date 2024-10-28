import { BrowserRouter as Router, Route, Switch } from 'react-router-dom';
import HomePage from './pages/HomePage';
import ElectionsPage from './pages/ElectionsPage';
import ResultsPage from './pages/ResultsPage';
import AdminPage from './pages/AdminPage';

function AppRoutes() {
  return (
    <Router>
      <Switch>
        <Route exact path="/" component={HomePage} />
        <Route path="/elections" component={ElectionsPage} />
        <Route path="/results" component={ResultsPage} />
        <Route path="/admin" component={AdminPage} />
      </Switch>
    </Router>
  );
}

export default AppRoutes;
