/* route/index.js */
import express from 'express';
import AppController from '../controllers/AppController.js';
import AuthController from '../controllers/AuthController.js';
import FilesController from '../controllers/FilesController.js';
import UsersController from '../controllers/UsersController.js';

const router = express.Router();

// Define endpoints
router.get('/status', AppController.getStatus);
router.get('/stats', AppController.getStats);

// New endpoint
router.post('/users', UsersController.postNew);
router.get('/connect', AuthController.getConnect);
router.get('/disconnect', AuthController.getDisconnect);
router.get('/users/me', UsersController.getMe);
router.post('/files', AuthController.isAuthenticated, FilesController.postUpload);
router.get('/files/:id', AuthController.isAuthenticated, FilesController.getShow);
router.get('/files', AuthController.isAuthenticated, FilesController.getIndex);
router.put('/files/:id/publish', AuthController.isAuthenticated, FilesController.putPublish);
router.put('/files/:id/unpublish', AuthController.isAuthenticated, FilesController.putUnpublish);
router.get('/files/:id/data', AuthController.isAuthenticated, FilesController.getFile);

export default router;
