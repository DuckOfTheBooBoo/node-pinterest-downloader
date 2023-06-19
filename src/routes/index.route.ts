import express,{ Router, Request, Response, NextFunction } from 'express';

const router: Router = express.Router();

router.get('/', (req: Request, res: Response) => {
    return res.render('index');
});

export default router;
