import express, {Application, Router} from 'express';
import { EmplController } from '../controllers/EmplController';
import cors from 'cors'; // Import the cors package

export class EmplRoutes {

    private app: Application;
    private router: Router = Router();
    private emplController = new EmplController();

    constructor(app: Application) {
        this.app = app;
        this.router.use(express.json());
        this.router.use(cors({
            origin: '*'
        })); 
        this.app.use('/empl', this.router);
    }

    public loadRoutes() {
        this.router.get('/hello', (req, res) => {
            res.send('Hello World');
        });
        this.router.get('/', (req, res) =>{
            this.emplController.getEmployees(req, res);
        });
        this.router.get('/get/:id', (req, res) =>{
            this.emplController.getEmployeeById(req, res);
        });
        this.router.post('/add', (req, res) =>{
            this.emplController.addEmployee(req, res);
        });
        this.router.put('/position/:id', (req, res) =>{
            this.emplController.updateEmployeePosition(req, res);
        });
        this.router.delete('/delete/:id', (req, res) =>{
            this.emplController.deleteEmployee(req, res);
        });
    }


}