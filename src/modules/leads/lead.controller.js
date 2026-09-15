const asyncHandler = require('../../middlewares/asyncHandler');
const sendResponse = require('../../utils/sendResponse');
const leadService = require('./lead.service');

const getAllLeads = asyncHandler(async (req, res) => {
  const result = await leadService.getAllLeads(req.user, req.query);
  return sendResponse(res, 200, 'Leads retrieved successfully', result.leads, result.pagination);
});

const getLeadById = asyncHandler(async (req, res) => {
  const lead = await leadService.getLeadById(req.params.id, req.user);
  return sendResponse(res, 200, 'Lead retrieved successfully', { lead });
});

const createLead = asyncHandler(async (req, res) => {
  const lead = await leadService.createLead(req.user, req.body);
  return sendResponse(res, 201, 'Lead created successfully', { lead });
});

const updateLead = asyncHandler(async (req, res) => {
  const lead = await leadService.updateLead(req.params.id, req.user, req.body);
  return sendResponse(res, 200, 'Lead updated successfully', { lead });
});

const updateLeadStatus = asyncHandler(async (req, res) => {
  const lead = await leadService.updateLeadStatus(req.params.id, req.user, req.body.status);
  return sendResponse(res, 200, 'Lead status updated successfully', { lead });
});

const deleteLead = asyncHandler(async (req, res) => {
  await leadService.deleteLead(req.params.id, req.user);
  return sendResponse(res, 200, 'Lead deleted successfully');
});

module.exports = {
  getAllLeads,
  getLeadById,
  createLead,
  updateLead,
  updateLeadStatus,
  deleteLead,
};
