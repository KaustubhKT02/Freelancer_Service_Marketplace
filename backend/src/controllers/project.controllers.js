import { users, projects } from "../models/models.js";
import { asyncHandler, apiError, apiResponse } from "../utils/utils.js";


// Create project
const createProject = asyncHandler(async (req, res) => {
  // get data from users
  const { title, description, budget, category } = req.body;

  // Add validation
  if (!title || !description || !budget || !category) {
    throw new apiError(400, "All fields are required");
  }

  // check user role

  if (req.user?.role !== "client") {
    throw new apiError(401, "Only client can create projects");
  }

  const project = await projects.create({
    title,
    description,
    budget,
    category,
    status: "open",
    client_id: req.user.id,
  });

  res
    .status(200)
    .json(new apiResponse(200, project, "Project Created Successfully"));
});

// Get All Projects(publics)
const getProject = asyncHandler(async (req, res) => {
  const projectList = await projects.findAll({
    include: [
      {
        model: users,
        as: "client",
        attributes: ["id", "fullname", "role", "email"],
      },
    ],
    order: [["createdAt", "DESC"]],
  });

  if (!projectList) {
    throw new apiError(401, "Projects not found");
  }

  res
    .status(200)
    .json(new apiResponse(200, projectList, "Project fetched sucessfully"));
});

// Get single project by id
const getProjectById = asyncHandler(async (req, res) => {
  const { id } = req.params;

  const project = await projects.findByPk(id, {
    include: [
      { model: users, as: "client", attributes: ["id", "fullname", "email"] },
    ],
  });

  if (!project) {
    throw new apiError(404, "Project not found");
  }

  res.status(200).json(new apiResponse(200, project));
});

//  Update project client only
const updateProject = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const { title, description, budget, status, category } = req.body;

  const project = await projects.findByPk(id);
  if (!project) {
    throw new apiError(400, "project not found");
  }

  if (req.user.role !== "client" || req.user.id !== project.client_id) {
    throw new apiError(400, "Unauthorized to update this project");
  }

  await project.update({
    title,
    description,
    budget,
    category,
    status,
  });

  res.status(200).json(new apiResponse(200, project, "Project update"));
});

// delete project client only
const deleteProject = asyncHandler(async (req, res) => {
  const { id } = req.params;

  const project = await projects.findByPk(id);

  if (!project) {
    throw new apiError(400, "Project not found");
  }

  if (req.user.role !== "client" || req.user.id !== project.client_id) {
    throw new apiError(400, "Unauthorized to delete project");
  }

  await project.destroy();

  res
    .status(200)
    .json(new apiResponse(200, {}, "Project successfully deleted"));
});

// mark project paid
const markProjectPaid = asyncHandler(async (req, res) => {
  const { projectId } = req.params;

  const project = await projects.findByPk(projectId);
  if (!project) {
    throw new apiError(404, "Project not found");
  }

  if (req.user.role !== "client" || req.user.id !== project.client_id) {
    throw new apiError(403, "You can not  mark this project as paid");
  }

  await project.update({ status: "completed" });

  res.status(200).json(new apiResponse(200, project, "Project status updated"));
});

export {
  createProject,
  getProject,
  getProjectById,
  updateProject,
  deleteProject,
  markProjectPaid,
};
