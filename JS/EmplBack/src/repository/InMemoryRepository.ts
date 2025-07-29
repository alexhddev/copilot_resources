import { type Employee } from '../model/Employee';

export class InMemoryRepository {

    private employees: Employee[] = [];

    public async getEmployees(): Promise<Employee[]> {
        return this.employees;
    }

    public async getEmployeeById(id: number): Promise<Employee | undefined> {
        return this.employees.find(e => e.id === id);
    }

    public async addEmployee(employee: Partial<Employee>) {
        const newEmployee = { id: this.employees.length + 1, ...employee } as Employee;
        this.employees.push(newEmployee);
        return newEmployee;
    }

    public async updateEmployeePosition(id: number, position: string) {
        const employee = this.employees.find(e => e.id === id);
        if (employee) {
            employee.position = position;
        }
        return employee;
    }

    public async deleteEmployee(id: number) {
        const index = this.employees.findIndex(e => e.id === id);
        if (index !== -1) {
            this.employees.splice(index, 1);
        }
        return index !== -1;
    }

    public async getEmployeesByPosition(position: string): Promise<Employee[]> {
        return this.employees.filter(e => e.position === position);
    }
}