import { Employee } from '../model/Employee';

const baseUrl = 'http://localhost:3000/empl/';

export async function addEmployee(employee: Partial<Employee>): Promise<void> {
    const response = await fetch(baseUrl + 'add', {
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

export async function getEmployees(): Promise<Employee[]> {
    const response = await fetch(baseUrl, {
        method: 'GET'        
    });
    if (!response.ok) {
        throw new Error('Failed to get employees');
    }
    const employees = await response.json();
    return parseEmployees(employees);
}

function parseEmployees(data: []): Employee[]{
    const employees: Employee[] = [];
    data.forEach((employee: any) => {
        employees.push({
            id: employee.id,
            firstName: employee.first_name,
            lastName: employee.last_name,
            hireDate: new String(employee.hire_date).split('T')[0],
            position: employee.position
        });
    });
    return employees;
}

export async function getEmployee(id: number): Promise<Employee | undefined> {
    const response = await fetch(baseUrl + 'get/' + id, {
        method: 'GET'
    });
    if (response.status === 404) {
        return undefined;
    }
    const employee = await response.json();
    return employee;
}

export async function getEmployeeBio(id: number): Promise<string> {
    const employee = await getEmployee(id);
    if (!employee) {
        return 'No bio available';
    }

    const bio = `
        ${employee.firstName} is a highly skilled and dedicated professional with extensive experience in the field. 
        Over the years, ${employee.firstName} has demonstrated exceptional abilities in various aspects of their role, 
        consistently delivering outstanding results. With a strong background in ${employee.position}, 
        ${employee.firstName} has been instrumental in driving key projects and initiatives that have significantly 
        contributed to the success of the organization. Known for their innovative approach and strategic thinking, 
        ${employee.firstName} is a valuable asset to the team, always striving for excellence and pushing the boundaries 
        of what is possible. Outside of work, ${employee.firstName} is passionate about food, travel, and photography,
        which further showcases their diverse talents and interests. ${employee.firstName}'s commitment to personal 
        and professional growth is truly inspiring, making them a role model for colleagues and peers alike.
    `;
    return bio;
}
    