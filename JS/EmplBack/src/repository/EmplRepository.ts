import { createPool } from 'mysql2/promise';
import { dbConfig } from '../config/dbConfig';

export class EmplRepository {

    private connection = createPool(dbConfig);

    public async getEmployees() {
        const [rows] = await this.connection.query('SELECT * FROM employees');
        return rows;
    }
}