import { users, projects } from "../models/models.js";
import { apiError } from "../utils/apiError.utils.js";
import { asyncHandler } from "../utils/asyncHandler.utils.js";
import { apiResponse } from "../utils/apiResponse.utils.js";
import { json } from "sequelize";

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
    include: [{model: users, as: "client", attributes: ['fullname', 'email', 'id']}]
  });

  if(!project) {
    throw new apiError(404, "Project not found")
  }

  res.status(200).json(new apiResponse(200, project))

});

//  Update project client only 
const updateProject = asyncHandler(async(req, res)=> {
  const {id} = req.params;
  const {title, description, budget, status: projectStatus , category } = req.body;

  const project = await projects.findByPk(id);
  if(!project){
    throw new apiError(400, "project not found");
  }

  if(req.user?.role !== 'Client' && project.client_id !== req.user?.id) {
    throw new apiError(400, "Unauthorized to update this project")
  }

  await project.update({
    title, description, budget, category, status: projectStatus,
  })

  

  res.status(200).json(new apiResponse(200, project, "Project update"));
  
})

// delete project client only 
 const deleteProject = asyncHandler(async(req, res)=> {
  const {id} = req.params;

  const project = await projects.findByPk(id);

  if(!project) {
    throw new apiError(400, "Project not found")
  }

  if(req.user?.id !== 'Client' && project.client_id !== req.user?.id) {
    throw new apiError(400, "Unauthorized to delete project")
  }

  await project.destroy()

  res.status(200).json(new apiResponse(200, "Project successfully deleted"))
 })
export {createProject, getProject, getProjectById, updateProject, deleteProject}