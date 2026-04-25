const asyncHandler = require('../../shared/middlewares/asyncHandler');
const sendResponse = require('../../shared/utils/sendResponse');
const prisma = require('../../shared/lib/prisma');

const getAllClients = asyncHandler(async (req, res) => {
  const clients = await prisma.client.findMany();
  sendResponse(res, 200, 'Clients retrieved successfully', { clients });
});

const createClient = asyncHandler(async (req, res) => {
  const { companyName, contactName, email, phone } = req.body;
  
  const client = await prisma.client.create({
    data: {
      companyName,
      contactName,
      email,
      phone,
      ownerId: req.user.id
    }
  });

  sendResponse(res, 201, 'Client created successfully', { client });
});

module.exports = {
  getAllClients,
  createClient
};
