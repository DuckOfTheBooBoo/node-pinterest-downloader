import express, { Application, Request, Response, NextFunction } from 'express';
import router from './routes/index.route';
import path from 'path';

const app: Application = express();
const PORT: number = 8080;

app.use('/public', express.static(path.join(__dirname, '..', 'public')));
app.engine('html', require('ejs').renderFile);
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));
app.use(router);

app.listen(PORT, () => {
    console.log(`Server is listening at port ${PORT}`);
});
