import React from 'react';
import { Link } from 'react-router-dom';

const Home: React.FC = () => {
    return (
        <div>
            <h1>Welcome to the awesome employees app</h1>
            <Link to="/add">Add Employee</Link>
            <br />
            <Link to="/list">List Employees</Link>
        </div>
    );
};

export default Home;