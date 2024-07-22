import express, {Application, Router} from 'express';

export class EmplRoutes {

    private app: Application;
    private router: Router = Router();

    constructor(app: Application) {
        this.app = app;
        this.router.use(express.json());
        this.app.use('/empl', this.router);
    }

    public loadRoutes() {
        this.router.get('/hello', (req, res) => {
            res.send('Hello World');
        })
    }


}