
import { projects, proposals, project_delivery } from "../models/models.js";
import {
  asyncHandler,
  apiError,
  apiResponse,
  uploadCloudinary,
} from "../utils/utils.js";

//  freelancer project delivery

const deliveryProject = asyncHandler(async (req, res) => {
  const { projectId } = req.params;
  const { text_note } = req.body;

  const project = await projects.findByPk(projectId);
  if (!project) {
    throw new apiError(404, "Project not found");
  }

  const freelancerProposal = await proposals.findOne({
    where: { freelancer_id: req.user?.id, project_id: projectId },
  });

  if (req.user.role !== "freelancer" || req.user?.id !== freelancerProposal.freelancer_id) {
    throw new apiError(403, "You can't delivery this project");
  }

//   file upload
  let fileUrl = null;

  if (req.file && req.file.path) {
    const uploadeFile = await uploadCloudinary(req.file.path);

    if (!uploadeFile) {
      throw new apiError(500, "Failed to uploade File");
    }
    fileUrl = uploadeFile.url;
  }

  const delivery = await project_delivery.create({
    project_id: projectId,
    freelancer_id: req.user.id,
    text_note,
    file_url: fileUrl,
  });

  await project.update({ status: "in-review" });
  await freelancerProposal.update({status: 'awaiting_payment'}) 

  res
    .status(200)
    .json(new apiResponse(200, delivery, "Project delivered for review"));
});

// client Accepted delivery 
const accepteDelivery = asyncHandler(async(req, res)=> {
    const {projectId} = req.params;

    const project =  await projects.findByPk(projectId);
    if(!project){
        throw new apiError(404, "Project not found");
    }

    if(req.user.role !== 'client' || req.user?.id !== project.client_id) {
        throw new apiError(403, "Only client can accepted project");
    }

    await project.update({status: 'awaiting_payment'}) 

    res.status(200).json(new apiResponse(200, project, "Delivery accepted. Please proceed to payment."))
});

export { deliveryProject, accepteDelivery };
