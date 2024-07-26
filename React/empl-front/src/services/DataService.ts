import { Employee } from '../model/Employee';

const baseUrl = 'http://localhost:3000/empl/';

export async function addEmployee(employee: Partial<Employee>): Promise<void> {
    const response = await fetch(baseUrl, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(employee)
    });
    if (!response.ok) {
        throw new Error('Failed to add employee');
    }
}