import { Router } from 'express';
import { initilizeResponse, submitResponse } from '../controllers/submitResponse';
import { getFormResponses } from '../controllers/formResponses';

const router = Router();

router.post('/submit', submitResponse);
router.post('/init',initilizeResponse);
router.post('/form/responses',getFormResponses);



export default router;