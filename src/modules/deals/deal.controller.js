const asyncHandler = require('../../middlewares/asyncHandler');
const sendResponse = require('../../utils/sendResponse');
const dealService = require('./deal.service');

const getAllDeals = asyncHandler(async (req, res) => {
  const result = await dealService.getAllDeals(req.user, req.query);
  return sendResponse(res, 200, 'Deals retrieved successfully', result.deals, result.pagination);
});

const getDealStats = asyncHandler(async (req, res) => {
  const stats = await dealService.getDealStats(req.user);
  return sendResponse(res, 200, 'Deal analytics and metrics calculated successfully', stats);
});

const getDealById = asyncHandler(async (req, res) => {
  const deal = await dealService.getDealById(req.params.id, req.user);
  return sendResponse(res, 200, 'Deal retrieved successfully', { deal });
});

const createDeal = asyncHandler(async (req, res) => {
  const deal = await dealService.createDeal(req.user, req.body);
  return sendResponse(res, 201, 'Deal created successfully', { deal });
});

const updateDeal = asyncHandler(async (req, res) => {
  const deal = await dealService.updateDeal(req.params.id, req.user, req.body);
  return sendResponse(res, 200, 'Deal updated successfully', { deal });
});

const deleteDeal = asyncHandler(async (req, res) => {
  await dealService.deleteDeal(req.params.id, req.user);
  return sendResponse(res, 200, 'Deal deleted successfully');
});

module.exports = {
  getAllDeals,
  getDealStats,
  getDealById,
  createDeal,
  updateDeal,
  deleteDeal,
};
