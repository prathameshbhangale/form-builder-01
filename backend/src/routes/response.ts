import { Router } from 'express';
import { initilizeResponse, submitResponse } from '../controllers/submitResponse';

const router = Router();

router.post('/submit', submitResponse);
router.post('/init',initilizeResponse)



export default router;