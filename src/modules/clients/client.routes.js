const express = require('express');
const clientController = require('./client.controller');
const {
  createClientSchema,
  updateClientSchema,
  queryClientSchema,
} = require('./client.schema');
const validate = require('../../middlewares/validate');
const protect = require('../../middlewares/protect');
const authorize = require('../../middlewares/authorize');

const router = express.Router();

router.use(protect);
router.use(authorize('admin', 'manager', 'sales'));

router.get('/', validate({ query: queryClientSchema }), clientController.getAllClients);
router.get('/:id', clientController.getClientById);
router.post('/', validate({ body: createClientSchema }), clientController.createClient);
router.put('/:id', validate({ body: updateClientSchema }), clientController.updateClient);
router.delete('/:id', clientController.deleteClient);

module.exports = router;
