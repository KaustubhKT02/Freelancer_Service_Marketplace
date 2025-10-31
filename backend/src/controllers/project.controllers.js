import { users, projects } from "../models/models.js";
import { apiError } from "../utils/apiError.utils.js";
import { asyncHandler } from "../utils/asyncHandler.utils.js";
import { apiResponse } from "../utils/apiResponse.utils.js";

const createProject = asyncHandler(async (req, res) => {
  // get data from users
  const { title, description, budget, category } = req.body;

  // check user role

  if (req.user?.role !== "Client") {
    throw new apiError(401, "Only Client can create projects");
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


export {createProject}