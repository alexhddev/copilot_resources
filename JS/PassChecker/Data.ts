export interface Employee {
    name: string;
    age: number;
    salary: number;
}

const employees: Employee[] = [
    { name: 'John', age: 25, salary: 2000 },
    { name: 'Linda', age: 30, salary: 2500 },
    { name: 'Alice', age: 35, salary: 3000 },
    { name: 'Bob', age: 40, salary: 3500 },
    { name: 'Peter', age: 45, salary: 4000 },
    { name: 'Karen', age: 50, salary: 4500 },
    { name: 'Mary', age: 55, salary: 5000 },
    { name: 'George', age: 60, salary: 5500 },
    { name: 'Lisa', age: 65, salary: 6000 },
    { name: 'John', age: 70, salary: 6500 },
];

/**
 * Finds an employee by their name.
 * @param name - The name of the employee to find.
 * @returns The found employee object.
 */
function findEmployeeByName(name: string): Employee | undefined {
    return employees.find(employee => employee.name === name) as Employee;
}

function filterEmployeesBySalary(salary: number): Employee[] {
    return employees.filter(employee => employee.salary >= salary);
}

function filterEmployeesByAgeAndSalary(age: number, salary: number): Employee[] {
    return employees.filter(employee => employee.age >= age && employee.salary >= salary);
}

function getAllEmployeesNames(): string[] {
    return employees.map(employee => employee.name);
}

function getMaxSalary(): number {
    return employees.reduce(
        (maxSalary, employee) => employee.salary > maxSalary ? employee.salary : maxSalary, 0);
}

function getAverageSalary(): number {
    return employees.reduce((sum, employee) => sum + employee.salary, 0) / employees.length;
}
