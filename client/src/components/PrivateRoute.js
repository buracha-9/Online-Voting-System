import React from 'react';
import { Navigate } from 'react-router-dom';

const PrivateRoute = ({ element, allowedRoles }) => {
    // Retrieve token and role from local storage
    const token = localStorage.getItem('token');
    const userRole = localStorage.getItem('role');

    // If no token, redirect to login
    if (!token) {
        return <Navigate to="/login" />;
    }

    // Check if user's role is included in the allowedRoles array
    if (allowedRoles && !allowedRoles.includes(userRole.toLowerCase())) {
        return <Navigate to="/not-authorized" />;
    }

    // If authenticated and role is allowed, render the component
    return element;
};

export default PrivateRoute;
