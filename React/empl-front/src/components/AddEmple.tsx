import React, { useState } from 'react';
import { addEmployee } from '../services/DataService';
import { Employee } from '../model/Employee';
import { Link } from 'react-router-dom';

const AddEmpl: React.FC = () => {
    const [firstName, setFirstName] = useState('');
    const [lastName, setLastName] = useState('');
    const [position, setPosition] = useState('');

    const handleAddEmployee =async  () => {
        const newEmployee: Partial<Employee> = {
            firstName,
            lastName,
            position,
            hireDate: new Date().toISOString().split('T')[0]
        };
        await addEmployee(newEmployee);
        // Reset form fields
        setFirstName('');
        setLastName('');
        setPosition('');
    };

    return (
        <div>
            <input
                type="text"
                placeholder="First Name"
                value={firstName}
                onChange={(e) => setFirstName(e.target.value)}
            />
            <input
                type="text"
                placeholder="Last Name"
                value={lastName}
                onChange={(e) => setLastName(e.target.value)}
            />
            <input
                type="text"
                placeholder="Position"
                value={position}
                onChange={(e) => setPosition(e.target.value)}
            />
            <button onClick={handleAddEmployee}>Add</button>
            <Link to="/list">Back to list</Link>
        </div>
    );
};

export default AddEmpl;