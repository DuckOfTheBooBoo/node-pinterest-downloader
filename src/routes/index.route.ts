import express,{ Router, Request, Response, NextFunction } from 'express';
import {downloadPinBoard, serveFile} from '../controller/download.controller';

const router: Router = express.Router();

router.get('/', (req: Request, res: Response) => {
    return res.render('index.html');
});

router.post('/download', downloadPinBoard)
router.get('/download/:fileId', serveFile)

export default router;
