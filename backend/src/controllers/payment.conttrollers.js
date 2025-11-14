import { projects, proposals, freelancer_accounts } from "../models/models.js";
import { asyncHandler, apiResponse, apiError } from "../utils/utils.js";

// Genrate UPI payments link for direct payment
const genrateUPIPaymentLink = asyncHandler(async (req, res) => {
  const { projectId } = req.params;

  const project = await projects.findByPk(projectId);
  if (!project) {
    throw new apiError(404, "Project not found");
  }

  if (req.user.role !== "client" || req.user?.id !== project.client_id) {
    throw new apiError(403, "You are not autorized to pay for this project");
  }

  const acceptedProposal = await proposals.findOne({
    where: { project_id: project.id, status: "accepted" },
  });

  if (!acceptedProposal) {
    throw new apiError(404, "No accepted freelancer for this project");
  }

  const freelancer = await user.findByPk(acceptedProposal.freelancer_id);
  if (!freelancer) {
    throw new apiError(404, "Freelancer not found");
  }

  const account = await freelancer_accounts.findOne({
    where: {
      user_id: freelancer.id,
    },
  });

  if (!account) {
    throw new apiError(404, "Freelancer UPI details not found");
  }

  const upiUrl = `upi://pay?pa=${account.upi_id}&pn=${encodeURIComponent(
    account.account_holder_name
  )}&am=${project.budget}&cu=INR&tn=${encodeURIComponent(project.title)}`;

  res
    .status(200)
    .json(
      new apiResponse(200, { upiUrl }, "payment link genrated successfully")
    );
});

export { genrateUPIPaymentLink };
