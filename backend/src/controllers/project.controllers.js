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


// Get All Projects(publics)

const getProject = asyncHandler(async(req, res)=> {
  // Get Project from database 
 try {
   const project = await projects.findAll({
     include: [{model: users, as: 'client', attributes: ["id", "fullname", "role", "email"]}],
     order: [["created_at", "Desc"]]
    })
 
    if(!project) {
     throw new apiError(401, "Projects not found")
    }
 
    res.status(200).json( new apiResponse(200, project))
 } catch (error) {
  throw new apiError(500, error?.message || "Server Error")
 }
});

// Get single project by id 
const getProjectById = asyncHandler(async(req, res)=> {
   const {id} = req.params;
    const project = await projects.findByPk(id, {
      include: [{model: users, as:'client', attributes: ["id", "fullname", "email"]}]
    });
  
    if(!project) {
      throw new apiError(404, "Project not found by given id")
    }
  
    res.status(200).json(new apiResponse(200, project, "Project fetch successfully"));
})




export {createProject, getProject, getProjectById}