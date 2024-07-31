import { EmplRepository } from "../repository/EmplRepository";
import { Request, Response } from "express";
import { InMemoryRepository } from "../repository/InMemoryRepository";



export class EmplController {

    private repository: EmplRepository = new EmplRepository();

    public async getEmployees(req: Request, res: Response) {
        try {
            const employees = await this.repository.getEmployees();
            res.send(employees);
        } catch (error) {
            console.error(error);
        }
    }

    public async getEmployeeById(req: Request, res: Response) {
        try {
            const id = parseInt(req.params.id);
            const employee = await this.repository.getEmployeeById(id);
            if (employee === undefined) {
                res.sendStatus(404);
            } else {
                res.send(employee);
            }
        } catch (error) {
            console.error(error);
        }
    }

    public async addEmployee(req: Request, res: Response) {
        try {
            const employee = req.body;
            await this.repository.addEmployee(employee);
            res.sendStatus(201);
        } catch (error) {
            console.error(error);
        }
    }

    public async updateEmployeePosition(req: Request, res: Response) {
        try {
            const id = parseInt(req.params.id);
            const position = req.body.position;
            await this.repository.updateEmployeePosition(id, position);
            res.sendStatus(204);
        } catch (error) {
            console.error(error);
        }
    }

    public async deleteEmployee(req: Request, res: Response) {
        try {
            const id = parseInt(req.params.id);
            await this.repository.deleteEmployee(id);
            res.sendStatus(204);
        } catch (error) {
            console.error(error);
        }
    }
}