import { Op } from "sequelize";
import { users, projects, proposals } from "../models/models.js";
import { asyncHandler, apiError, apiResponse } from "../utils/utils.js";

// Send Proposal to projec (client only)

const sendProposal = asyncHandler(async (req, res) => {
  const { project_id, cover_letter, bid_amount } = req.body;

  if (!project_id || !cover_letter || !bid_amount) {
    throw new apiError(400, "All field are required");
  }

  if (req.user.role !== "freelancer") {
    throw new apiError(403, "Only Freelancers can submit proposals");
  }

  const project = await projects.findByPk(project_id);
  if (!project) {
    throw new apiError(404, "Project not found");
  }

  if (project.status !== "open") {
    throw new apiError(400, "Cannot send proposal. Project is not open");
  }

  const existing = await proposals.findOne({
    where: {
      project_id,
      freelancer_id: req.user?.id,
    },
  });

  if (existing) {
    throw new apiError(
      400,
      "You already submitted a proposal for this project"
    );
  }

  const proposal = await proposals.create({
    project_id,
    freelancer_id: req.user.id,
    bid_amount,
    cover_letter,
  });

  res
    .status(201)
    .json(new apiResponse(201, proposal, "propsal submited successfully."));
});

// Get all proposal (client only)

const getProposalForProject = asyncHandler(async (req, res) => {
  const { projectId } = req.params;

  const project = await projects.findByPk(projectId);
  if (!project) {
    throw new apiError(404, "Project not found");
  }

  if (req.user.role !== "client" || req.user.id !== project.client_id) {
    throw new apiError(403, "Unauthorized to view proposals for this project");
  }

  const proposal = await proposals.findAll({
    where: { project_id: projectId },
    include: [
      {
        model: users,
        as: "freelancer",
        attributes: ["id", "fullname", "email", "rating_avg", "avatar"],
      },
    ],
    order: [["createdAt", "DESC"]],
  });

  res
    .status(200)
    .json(new apiResponse(200, proposal, "proposal fetched successfully"));
});

// Get all proposals (freelancer)

const getMyProposals = asyncHandler(async (req, res) => {
  if (req.user.role !== "freelancer") {
    throw new apiError(
      403,
      "Access denied: only freelancers can view their proposals"
    );
  }

  const proposal = await proposals.findAll({
    where: { freelancer_id: req.user.id },
    include: [
      {
        model: projects,
        as: "project",
        attributes: ["id", "title", "budget", "status", "category"],
      },
    ],
    order: [["createdAt", "DESC"]],
  });

  res
    .status(200)
    .json(new apiResponse(200, proposal, "proposal fetched successfully"));
});

// Accept/Reject Proposal(client only)
const updateProposalStatus = asyncHandler(async (req, res) => {
  const { proposalId } = req.params;
  const { status } = req.body;

  if (!["accepted", "rejected"].includes(status)) {
    throw new apiError(400, "Invalid status. Must be accepted or rejected");
  }

  const proposal = await proposals.findByPk(proposalId, {
    include: {
      model: projects,
      as: "project",
      attributes: ["id", "client_id", "title", "status"],
    },
  });

  if (!proposal) {
    throw new apiError(404, "Proposal not found");
  }

  //  Authorization check
  if (
    req.user.role !== "client" ||
    req.user.id !== proposal.project.client_id
  ) {
    throw new apiError(403, "Unauthorized to update this proposal");
  }

  // Check for existing accepted proposal BEFORE saving
  if (status === "accepted") {
    const existingAccept = await proposals.findOne({
      where: {
        project_id: proposal.project_id,
        status: "accepted",
        id: { [Op.ne]: proposalId },
      },
    });

    if (existingAccept) {
      throw new apiError(400, "This project already has an accepted proposal");
    }
  }

  // Update proposal status
  await proposal.update({ status });

  // If accepted, update project status
  if (status === "accepted") {
    await proposal.project.update({ status: "in progress" });
  }

  res.status(200).json(new apiResponse(200, `Proposal ${status}`, proposal));
});

export {
  sendProposal,
  getProposalForProject,
  getMyProposals,
  updateProposalStatus,
};
