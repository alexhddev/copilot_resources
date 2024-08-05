import { useEffect, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import { getEmployee, getEmployeeBio } from '../services/DataService';
import { Employee } from '../model/Employee';

const EmplDetails = () => {
    const { id } = useParams<{ id: string }>();
    const [employee, setEmployee] = useState<Employee | null>(null);
    const [bio, setBio] = useState<string | null>(null);

    useEffect(() => {
        const fetchEmployeeData = async () => {
            if (id) {
                const parsedID = parseInt(id);
                const employeeData = await getEmployee(parsedID);
                const employeeBio = await getEmployeeBio(parsedID);
                if (employeeData && employeeBio) {
                    setEmployee(employeeData);
                    setBio(employeeBio);
                }
            }
        };

        fetchEmployeeData();
    }, [id]);

    if (!employee || !bio) {
        return <div>Loading...</div>;
    }

    return (
        <div>
            <h2>Employee Details</h2>
            <p><strong>Name:</strong> {employee.firstName} {employee.lastName}</p>
            <p><strong>Position:</strong> {employee.position}</p>
            <p><strong>Hire date:</strong> {employee.hireDate}</p>
            <br />
            <p><strong>Bio:</strong>{bio}</p>
            <br />
            <Link to="/list">Back to list</Link>

        </div>
    );
};

export default EmplDetails;