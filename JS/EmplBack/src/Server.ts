import express from 'express';
import { EmplRoutes } from './routes/EmplRoutes';


export class Server {

    private app = express();

    private routes = new EmplRoutes(this.app);

    /**
     * Starts the server by loading application routes and listening on port 3000.
     * Logs a message when the server starts successfully.
     * Handles server errors by logging an error message to the console.
     */
    public startServer() {
        this.routes.loadRoutes();
        this.app.listen(3000, () => {
            console.log('Server started on port 3000');
        });
        this.app.on('error', (err) => {
            console.error('Server error');
        });

    }



}