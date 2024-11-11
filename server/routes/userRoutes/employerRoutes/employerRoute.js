import { Router } from 'express';
import {
  createEmployer,
  getEmployerById,
  updateEmployer,
  deleteEmployer
} from '../../../controllers/employerController.js';
import multer from 'multer';

// Configure multer with file size and type restrictions
const storage = multer.memoryStorage();
const fileFilter = (req, file, cb) => {
  const allowedTypes = ['application/pdf', 'image/jpeg', 'image/png', 'application/msword', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document'];
  
  if (allowedTypes.includes(file.mimetype)) {
    cb(null, true);
  } else {
    cb(new Error('Invalid file type. Only PDF, JPEG, PNG, and DOC/DOCX files are allowed.'), false);
  }
};

const upload = multer({
  storage: storage,
  limits: {
    fileSize: 5 * 1024 * 1024, // 5MB limit
  },
  fileFilter: fileFilter
});

// Support multiple file uploads with specific fields for employer
const uploadFields = upload.fields([
  { name: 'businessPermit', maxCount: 1 },
  { name: 'companyLogo', maxCount: 1 },
  { name: 'registrationDocs', maxCount: 1 },
  { name: 'otherDocs', maxCount: 3 }
]);

const router = Router();

// Apply upload middleware to routes that need it
router.post('/', uploadFields, createEmployer);
router.get('/:id', getEmployerById);
router.put('/:id', uploadFields, updateEmployer);
router.delete('/:id', deleteEmployer);

export default router;