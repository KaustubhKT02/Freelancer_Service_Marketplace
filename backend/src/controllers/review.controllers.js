import { apiError, apiResponse, asyncHandler } from "../utils/utils.js";
import { reviews, projects, proposals, users } from "../models/models.js";

// create Review (client - freelancer)

const createReview = asyncHandler(async (req, res) => {
  const { projectId } = req.params;
  const { rating, comment } = req.body;

  if (!rating || rating < 1 || rating > 5) {
    throw new apiError(400, "Rating must be between 1 and 5");
  }

  const project = await projects.findByPk(projectId);
  if (!project) {
    throw new apiError(404, "Project not found");
  }

  if (project.client_id !== req.user.id) {
    throw new apiError(403, "You can not review this project");
  }

  if (project.status !== "completed") {
    throw new apiError(
      400,
      "You can only review a project after payment and completion"
    );
  }

  //  acceptedProposal

  const acceptedProposal = await proposals.findOne({
    where: {
      project_id: projectId,
      status: "accepted",
    },
  });

  if (!acceptedProposal) {
    throw new apiError(404, "No freelancer assigned to this project");
  }

  const existing = await reviews.findOne({
    where: {
      project_id: projectId,
      client_id: req.user.id,
      freelancer_id: acceptedProposal.freelancer_id,
    },
  });

  if (existing) {
    throw new apiError(400, "You already reviewed this project");
  }

  const review = await reviews.create({
    project_id: projectId,
    client_id: req.user.id,
    freelancer_id: acceptedProposal.freelancer_id,
    rating,
    comment,
  });

  // update freelancer rating avrage
  const allReviews = await reviews.findAll({
    where: {
      freelancer_id: acceptedProposal.freelancer_id,
    },
  });

  const avg =
    allReviews.reduce((sum, r) => sum + r.rating, 0) / allReviews.length;

  await users.update(
    {
      rating_avg: avg.toFixed(1),
    },
    { where: { id: acceptedProposal.freelancer_id } }
  );

  res
    .status(201)
    .json(new apiResponse(201, review, "Review submitted successfully"));
});

//  Get Reviwes for freelancer

const getReview = asyncHandler(async (req, res) => {
  const { freelancerId } = req.params;

  const data = await reviews.findAll({
    where: {
      freelancer_id: freelancerId,
    },
    include: {
      model: users,
      as: "client",
      attributes: ["id", "fullname", "avatar"],
    },
    order: [["createdAt", "DESC"]],
  });

  res
    .status(200)
    .json(new apiResponse(200, data, "Freelancer reviews fetched"));
});

//  Get Reviwes for a specific project
const getProjectReview = asyncHandler(async (req, res) => {
  const { projectId } = req.params;

  const review = await reviews.findAll({
    where: { project_id: projectId },
    include: [
      { model: users, as: "client", attributes: ["id", "fullname", "avatar"] },
    ],
    order: [["createdAt", "DESC"]],
  });

  res.status(200).json(new apiResponse(200, review, "Project review fetched"));
});

export { createReview, getReview, getProjectReview };
