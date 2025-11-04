import { Model } from "sequelize";
import { users, projects, proposals } from "../models/models.js";
import { asyncHandler, apiError, apiResponse } from "../utils/utils.js";

// Send Proposal to projec (client only)

const sendProposal = asyncHandler(async (req, res) => {
  const { project_id, cover_letter, bid_amount } = req.body;

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
    throw new apiResponse(
      400,
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

const getProposalForProject = asyncHandler(async(req, res)=> {
  const {projectId} = req.params;

    const project = await projects.findByPk(project_id);
    if(!project) {
      throw new apiError(404, "Project not found");
    }

    if(req.user?.role !== 'client' && projects.client_id !== req.user?.id){
      throw new apiError(403, "unauthorized to view proposals");
    }

   const proposal = await proposals.findAll({
      where: {project_id: projectId},
      include: [{model: users, as: 'freelancer', attributes: ["id", "fullname", "email",  "rating_avg"]}],
      order: [["created_at", "DESC"]]
    })

    res.status(200).json(new apiResponse(200, proposal, "proposal fetched successfully"))
});

// Get all proposals (freelancer)

const getMyProposals = asyncHandler(async(req, res)=> {
  if(req.user?.role !== 'freelancer' && req.user?.id !== proposals.freelancer_id) {
    throw new apiError(403, "Access denied")
  }

  const proposal =  await proposals.findAll({freelancer_id: req.user?.id}, {
    include: [{model: projects, as: 'project', attributes: ["title", "budget", "status"]}],
    order: [["created_at", "DESC"]]
  })

  res.status(200).json(new apiResponse(200, proposal, "proposal fetched successfully"))
});

// Accept/Reject Proposal(client only)
const updatePropsalStatus = asyncHandler(async(req, res)=> {
  const {proposalId} = req.params;
  const {status} = req.body;

  const proposal =  await proposals.findByPk(proposalId, {
    include: {projects}
  });

  if(!proposal) {
  throw new apiError(404, "Proposal not found")
  }

  if(req.user?.role !== 'client' && proposals.projects.client_id !== req.user?.id) {
    throw new apiError(403, "Unauthorized to modify proposal")
  }

  if(!['accepted', 'rejected'].include(status)) {
    throw new apiError(400, "Invalid Status")
  }

  await proposals.update({status})

  res.status(200).json(new apiResponse(200, `proposal ${status}`, proposal))
});

export {sendProposal, getProposalForProject, getMyProposals, updatePropsalStatus};
