import { Model, where } from "sequelize";
import { users, projects, proposals } from "../models/models.js";
import { asyncHandler, apiError, apiResponse } from "../utils/utils.js";

// Send Proposal to projec (client only)

const sendProposal = asyncHandler(async (req, res) => {
  const { project_id, cover_letter, bid_amount } = req.body;

  if (!project_id || !cover_letter || !bid_amount) {
    throw new apiError(401, "All field are required");
  }

  if (req.user?.role !== "freelancer") {
    throw new apiError(403, "Only Freelancers can submit proposals");
  }

  const project = await projects.findByPk(project_id);
  if (!project) {
    throw new apiError(404, "Project not found");
  }

  const existing = await proposals.findOne({
    where: {
      project_id,
      freelancer_id: req.user?.id,
    },
  });

  if (existing) {
    throw new apiError(
      500,
      "You already submitted a proposal for this project"
    );
  }

  const proposal = await proposals.create({
    project_id,
    freelancer_id: req.user?.id,
    bid_amount,
    cover_letter,
  });

  res
    .status(200)
    .json(new apiResponse(200, proposal, "propsal submited successfully."));
});

// Get all proposal (client only)

const getProposalForProject = asyncHandler(async (req, res) => {
  const { projectId } = req.params;

  const project = await projects.findByPk(projectId);
  if (!project) {
    throw new apiError(404, "Project not found");
  }

  if (req.user?.role !== "client" || project.client_id !== req.user?.id) {
    throw new apiError(
      403,
      "Only clients can view proposals for their projects"
    );
  }

  const proposal = await proposals.findAll({
    where: { project_id: projectId },
    include: [
      {
        model: users,
        as: "freelancer",
        attributes: ["id", "fullname", "email", "rating_avg"],
      },
    ],
    order: [["created_at", "DESC"]],
  });

  res
    .status(200)
    .json(new apiResponse(200, proposal, "proposal fetched successfully"));
});

// Get all proposals (freelancer)

const getMyProposals = asyncHandler(async (req, res) => {
  if (req.user?.role !== "freelancer") {
    throw new apiError(
      403,
      "Access denied: only freelancers can view their proposals"
    );
  }

  const proposal = await proposals.findAll({
    where: { freelancer_id: req.user?.id },
    include: [
      {
        model: projects,
        as: "project",
        attributes: ["title", "budget", "status"],
      },
    ],
    order: [["created_at", "DESC"]],
  });

  res
    .status(200)
    .json(new apiResponse(200, proposal, "proposal fetched successfully"));
});

// Accept/Reject Proposal(client only)
const updatePropsalStatus = asyncHandler(async (req, res) => {
  const { proposalId } = req.params;
  const { status } = req.body;

  const proposal = await proposals.findByPk(proposalId, {
    include: {
      model: projects,
      as: "project",
      attributes: ["id", "client_id", "status", "title"],
    },
  });

  if (!proposal) {
    throw new apiError(404, "Proposal not found");
  }

  if (
    req.user?.role !== "client" ||
    proposal.project.client_id !== req.user.id
  ) {
    throw new apiError(403, "Unauthorized to modify proposal");
  }

  if (!["accepted", "rejected"].includes(status)) {
    throw new apiError(400, "Invalid Status");
  }

  proposal.status = status;
  await proposal.save();

  if (status === "accepted") {
    proposal.project.status = "closed";
    await proposal.project.save();
  }

  res.status(200).json(new apiResponse(200, `proposal ${status}`, proposal));
});

export {
  sendProposal,
  getProposalForProject,
  getMyProposals,
  updatePropsalStatus,
};
