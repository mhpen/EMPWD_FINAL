import express from 'express';
import {
  getAllEmployers,
  getEmployerById,
  createEmployer,
  updateEmployer,
  deleteEmployer
} from '../../../controllers/employerController.js';

const router = express.Router();

// Routes for employers
router.get('/', getAllEmployers);                // GET all employers
router.get('/:id', getEmployerById);             // GET employer by ID
router.post('/', createEmployer);                // POST create a new employer
router.put('/:id', updateEmployer);              // PUT update employer by ID
router.delete('/:id', deleteEmployer);           // DELETE employer by ID

export default router;