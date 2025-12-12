/**
 * @summary
 * Internal API routes configuration.
 * Handles authenticated endpoints for business operations.
 *
 * @module routes/internalRoutes
 */

import { Router } from 'express';
import * as initExampleController from '@/api/internal/init-example/controller';
import * as userController from '@/api/internal/user/controller';

const router = Router();

/**
 * @rule {be-route-configuration}
 * Init-Example routes - /api/internal/init-example
 */
router.get('/init-example', initExampleController.listHandler);
router.post('/init-example', initExampleController.createHandler);
router.get('/init-example/:id', initExampleController.getHandler);
router.put('/init-example/:id', initExampleController.updateHandler);
router.delete('/init-example/:id', initExampleController.deleteHandler);

/**
 * @rule {be-route-configuration}
 * User routes - /api/internal/user
 */
router.post('/user/register', userController.registerHandler);
router.post('/user/login', userController.loginHandler);
router.get('/user/profile/:id', userController.getProfileHandler);
router.put('/user/profile/:id', userController.updateProfileHandler);
router.post('/user/confirm-email', userController.confirmEmailHandler);
router.post('/user/request-password-reset', userController.requestPasswordResetHandler);
router.post('/user/reset-password', userController.resetPasswordHandler);

export default router;
