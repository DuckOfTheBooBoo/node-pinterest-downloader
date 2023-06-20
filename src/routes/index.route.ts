import express,{ Router, Request, Response, NextFunction } from 'express';
import downloadPinBoard from '../controller/download.controller';

const router: Router = express.Router();

router.get('/', (req: Request, res: Response) => {
    return res.render('index.html');
});

router.post('/download', downloadPinBoard)

export default router;
