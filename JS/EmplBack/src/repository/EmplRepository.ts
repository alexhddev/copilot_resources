import { createPool } from 'mysql2/promise';
import { dbConfig } from '../config/dbConfig';
import { Employee } from '../model/Employee';
import e from 'express';

export class EmplRepository {

    private connection = createPool(dbConfig);

    public async getEmployees(): Promise<Employee[]> {
        const result = await this.connection.query('SELECT * FROM employees');
        return result[0] as Employee[];
    }

    public async getEmployeeById(id: number): Promise<Employee | undefined> {
        const result = await this.connection.query('SELECT * FROM employees WHERE id = ?', [id]);
        const empl = result[0] as Employee[];
        if (empl.length === 0) {
            return undefined;
        }
        return empl[0];        
    }

    public async addEmployee(employee: Partial<Employee>) {
        const result = await this.connection.query(
            'INSERT INTO employees (first_name, last_name, hire_date, position) VALUES (?, ?, ?, ?)',[
                employee.firstName, employee.lastName, employee.hireDate, employee.position
            ]);
        return result[0];            
    }

    public async updateEmployeePosition(id: number, position: string) {
        const result = await this.connection.query(
            'UPDATE employees SET position = ? WHERE id = ?', [position, id]);
        return result[0];            
    }

    public async deleteEmployee(id: number) {
        const result = await this.connection.query(
            'DELETE FROM employees WHERE id = ?', [id]);
        return result[0];            
    }

    public async getEmployeesByPosition(position: string): Promise<Employee[]> {
        const result = await this.connection.query('SELECT * FROM employees WHERE position = ?', [position]);
        return result[0] as Employee[];
    }
}