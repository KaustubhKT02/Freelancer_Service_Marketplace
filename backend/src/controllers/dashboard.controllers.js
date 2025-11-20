import { where } from "sequelize";
import {
  users,
  projects,
  proposals,
  messages,
  reviews,
  payment_logs
} from "../models/models.js";
import { asyncHandler, apiError, apiResponse } from "../utils/utils.js";

// Client dashboard

const clientDashboard = asyncHandler(async (req, res) => {
  const { clientId } = req.params;

  if (req.user.role !== "client" || req.user.id != clientId) {
    throw new apiError(403, "Only Clients can access this dashboard");
  }

  // Total Project
  const totalProject = await projects.count({ where: { client_id: clientId } });

  // completed project
  const completedProjects = await projects.count({
    where: {
      client_id: clientId,
      status: "completed",
    },
  });
  // ongoing projects
  const activeProjects = await projects.count({
    client_id: clientId,
    status: "in progress",
  });
  // total proposal recieved
  const totalProposalReecived = await proposals.count({
    include: {
      model: projects,
      as: "project",
      where: { client_id: clientId },
    },
  });

  // Recent messages
  const recentMessages = await messages.findAll({
    where: { receiver_id: clientId },
    order: [["createdAt", "DESC"]],
    limit: 5,
  });

  // Payments made (direct payment logs from you table)
  const PaymentsDone = await payment_logs.count({
    where: {client_id: clientId}
  })

  const data = {
    totalProject,
    completedProjects,
    activeProjects,
    totalProposalReecived,
    recentMessages,
    PaymentsDone
  };

  res
    .status(200)
    .json(new apiResponse(200, data, "Client dashboard fetched"));
});

// Freelancer Dashboard
const freelancerDashboard = asyncHandler(async (req, res) => {
  const { freelancerId } = req.params;

  if (req.user.role !== "freelancer" || req.user.id != freelancerId) {
    throw new apiError(403, "Only Freelancer can access this dashboard");
  }

  // total proposal send
  const totalProposalSend = await proposals.count({
    where: { freelancer_id: freelancerId },
  });
  // Accepted Proposals(jobs won)
  const acceptedProposals = await proposals.count({
    where: { freelancer_id: freelancerId, status: "accepted" },
  });
  // Active jobs
  const activeJobs = await projects.count({
    where: {
      freelancer_id: freelancerId,
      status: "accepted",
    },
    include: [
      {
        model: projects,
        as: "project",
        where: { status: ["in progress", "in-review"] },
      },
    ],
  });
  // Completed jobs
  const completedJobs = await proposals.count({
    where: {
      freelancer_id: freelancerId,
      status: "completed",
    },
  });
  // total reviews
  const totalReviws = await reviews.count({
    where: { freelancer_id: freelancerId },
  });
  // Latest reviews
  const latestRevies = await reviews.findAll({
    where: { freelancer_id: freelancerId },
    order: [["createdAt", "DESC"]],
    limit: 5,
  });
  // Approx earning count (direct payment -> count payment)
  const earnings = await payment_logs.count({where: {
    freelancer_id: freelancerId
  }})

  const data = {
    totalProposalSend,
    acceptedProposals,
    activeJobs,
    completedJobs,
    totalReviws,
    latestRevies,
    earnings
  };

  res.status(200).json(200, data, "Freelancer dashboard fetched");
});

// Admin dashboards

const adminDashboard = asyncHandler(async (req, res) => {
  if (req.user?.role !== "admin") {
    throw new apiError(403, "Only Admin can view this Dashboard");
  }

  const totalUsers = await users.count();
  const totalClient = await users.count({ where: { role: "client" } });
  const totalFreelancer = await users.count({ where: { role: "freelancer" } });

  const totalProjects = await projects.count();
  const completedProjects = await projects.count({
    where: { status: "completed" },
  });
  const pendingProposals = await proposals.count({
    where: { status: "pending" },
  });
  const totalRevies = await reviews.count();

  // recent 5 users
  const recentUsers = await users.findAll({
    limit: 5,
    order: [["createdAt", "DESC"]],
    attributes: ["id", "fullname", "email", "role"],
  });

  // payment overviews
  const totalPayments = await payment_logs.count();
  const totalPaidAmount = await payment_logs.sum("amount")

  const data = {
    totalUsers,
    totalClient,
    totalFreelancer,
    totalProjects,
    completedProjects,
    pendingProposals,
    totalRevies,
    recentUsers,
    totalPayments,
    totalPaidAmount
  };

  res.status(200).json(new apiResponse(200, data, "Admin Dashboard fetched"))
});

export { clientDashboard, freelancerDashboard, adminDashboard };
