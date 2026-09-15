const asyncHandler = require('../../middlewares/asyncHandler');
const sendResponse = require('../../utils/sendResponse');
const clientService = require('./client.service');

const getAllClients = asyncHandler(async (req, res) => {
  const result = await clientService.getAllClients(req.user, req.query);
  return sendResponse(res, 200, 'Clients retrieved successfully', result.clients, result.pagination);
});

const getClientById = asyncHandler(async (req, res) => {
  const client = await clientService.getClientById(req.params.id, req.user);
  return sendResponse(res, 200, 'Client retrieved successfully', { client });
});

const createClient = asyncHandler(async (req, res) => {
  const client = await clientService.createClient(req.user, req.body);
  return sendResponse(res, 201, 'Client created successfully', { client });
});

const updateClient = asyncHandler(async (req, res) => {
  const client = await clientService.updateClient(req.params.id, req.user, req.body);
  return sendResponse(res, 200, 'Client updated successfully', { client });
});

const deleteClient = asyncHandler(async (req, res) => {
  await clientService.deleteClient(req.params.id, req.user);
  return sendResponse(res, 200, 'Client deleted successfully');
});

module.exports = {
  getAllClients,
  getClientById,
  createClient,
  updateClient,
  deleteClient,
};
