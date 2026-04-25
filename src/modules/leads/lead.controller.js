const asyncHandler = require('../../shared/middlewares/asyncHandler');
const sendResponse = require('../../shared/utils/sendResponse');
const prisma = require('../../shared/lib/prisma');
const AppError = require('../../shared/utils/AppError');

const updateLead = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const { status, name } = req.body;

  const lead = await prisma.lead.findUnique({
    where: { id: parseInt(id, 10) }
  });

  if (!lead) {
    throw new AppError('Lead not found', 404);
  }

  // Ownership rule: sales role can only edit their own leads
  if (req.user.role === 'sales' && lead.userId !== req.user.id) {
    throw new AppError('You can only edit your own leads', 403);
  }

  const updatedLead = await prisma.lead.update({
    where: { id: parseInt(id, 10) },
    data: { status, name }
  });

  sendResponse(res, 200, 'Lead updated successfully', { lead: updatedLead });
});

module.exports = {
  updateLead
};
