"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const userController_1 = require("@/controllers/userController");
const auth_1 = require("@/middleware/auth");
const validation_1 = require("@/middleware/validation");
const router = (0, express_1.Router)();
router.use(auth_1.authenticate);
router.get('/', validation_1.validatePagination, userController_1.userController.getUsers);
router.get('/stats', (0, auth_1.authorize)('Administrator'), userController_1.userController.getUserStats);
router.get('/:id', validation_1.validateId, userController_1.userController.getUserById);
router.post('/', (0, auth_1.authorize)('Administrator'), validation_1.validateCreateUser, userController_1.userController.createUser);
router.put('/:id', (0, auth_1.authorize)('Administrator'), validation_1.validateId, validation_1.validateUpdateUser, userController_1.userController.updateUser);
router.delete('/:id', (0, auth_1.authorize)('Administrator'), validation_1.validateId, userController_1.userController.deleteUser);
router.patch('/:id/deactivate', (0, auth_1.authorize)('Administrator'), validation_1.validateId, userController_1.userController.deactivateUser);
router.patch('/:id/activate', (0, auth_1.authorize)('Administrator'), validation_1.validateId, userController_1.userController.activateUser);
exports.default = router;
//# sourceMappingURL=userRoutes.js.map