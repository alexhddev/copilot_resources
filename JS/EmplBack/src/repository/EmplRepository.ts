import { createPool } from 'mysql2/promise';
import { dbConfig } from '../config/dbConfig';
import { Employee } from '../model/Employee';
import e from 'express';

/**
 * Repository class for managing employee data.
 */
export class EmplRepository {

    private connection = createPool(dbConfig);

    /**
     * Retrieves all employees from the database.
     * @returns A promise that resolves to an array of Employee objects.
     */
    public async getEmployees(): Promise<Employee[]> {
        const result = await this.connection.query('SELECT * FROM employees');
        return result[0] as Employee[];
    }

    /**
     * Retrieves an employee by their ID.
     * @param id - The ID of the employee.
     * @returns A promise that resolves to the Employee object if found, otherwise undefined.
     */
    public async getEmployeeById(id: number): Promise<Employee | undefined> {
        const result = await this.connection.query('SELECT * FROM employees WHERE id = ?', [id]);
        const empl = result[0] as Employee[];
        if (empl.length === 0) {
            return undefined;
        }
        return empl[0];        
    }

    /**
     * Adds a new employee to the database.
     * @param employee - The employee object to add.
     * @returns A promise that resolves to the result of the insertion.
     */
    public async addEmployee(employee: Partial<Employee>) {
        const result = await this.connection.query(
            'INSERT INTO employees (first_name, last_name, hire_date, position) VALUES (?, ?, ?, ?)',[
                employee.firstName, employee.lastName, employee.hireDate, employee.position
            ]);
        return result[0];            
    }

    /**
     * Updates the position of an employee.
     * @param id - The ID of the employee.
     * @param position - The new position of the employee.
     * @returns A promise that resolves to the result of the update.
     */
    public async updateEmployeePosition(id: number, position: string) {
        const result = await this.connection.query(
            'UPDATE employees SET position = ? WHERE id = ?', [position, id]);
        return result[0];            
    }

    /**
     * Deletes an employee from the database.
     * @param id - The ID of the employee to delete.
     * @returns A promise that resolves to the result of the deletion.
     */
    public async deleteEmployee(id: number) {
        const result = await this.connection.query(
            'DELETE FROM employees WHERE id = ?', [id]);
        return result[0];            
    }

    /**
     * Retrieves employees by their position.
     * @param position - The position of the employees to retrieve.
     * @returns A promise that resolves to an array of Employee objects.
     */
    public async getEmployeesByPosition(position: string): Promise<Employee[]> {
        const result = await this.connection.query('SELECT * FROM employees WHERE position = ?', [position]);
        return result[0] as Employee[];
    }
}