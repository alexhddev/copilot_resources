import { useEffect, useState } from 'react';
import { getEmployees } from '../services/DataService';
import { Employee } from '../model/Employee';
import { Link } from 'react-router-dom';

const ListEmpl = () => {
    const [employees, setEmployees] = useState<Employee[]>([]);

    useEffect(() => {
        const fetchEmployees = async () => {
            try {
                const data = await getEmployees();
                setEmployees(data);
            } catch (error) {
                console.error('Error fetching employees:', error);
            }
        };

        fetchEmployees();
    }, []);

    return (
        <div>
            <h1>Employee List</h1>
            <table>
                <thead>
                    <tr>
                        <th>First Name</th>
                        <th>Last Name</th>
                        <th>Hire Date</th>
                        <th>Position</th>
                        <th>Details</th>
                    </tr>
                </thead>
                <tbody>
                    {employees.map(employee => (
                        <tr key={employee.id}>
                            <td>{employee.firstName}</td>
                            <td>{employee.lastName}</td>
                            <td>{employee.hireDate}</td>
                            <td>{employee.position}</td>
                            <td><Link to={`/details/${employee.id}`}>Details</Link></td>
                        </tr>
                    ))}
                </tbody>
            </table>
            <Link to="/add">Add Employee</Link>
        </div>
    );
};

export default ListEmpl;

