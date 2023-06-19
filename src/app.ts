import express, { Application, Request, Response, NextFunction } from 'express';

const app: Application = express();
const PORT: number = 8080;

app.get('/', (req: Request, res: Response,  next: NextFunction) => {
    res.status(200).send({
        data: 'Hello from Arajdian Altaf'
    });
});

app.listen(PORT, () => {
    console.log(`Server is listening at port ${PORT}`);
});
