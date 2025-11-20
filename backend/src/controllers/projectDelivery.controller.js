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
    where: {
      freelancer_id: req.user.id,
      project_id: projectId,
      status: "accepted",
    },
  });

  if (!freelancerProposal) {
    throw new apiError(
      403,
      "You are not assigned to this project or it is not accepted"
    );
  }

  //   file upload
  let fileUrl = null;

  if (req.file?.path) {
    const uploadeFile = await uploadCloudinary(req.file.path);

    if (!uploadeFile) {
      throw new apiError(500, "Failed to uploade File");
    }
    fileUrl = uploadeFile.url;
  }

  // Check if delivery already exists
  const existingDelivery = await project_delivery.findOne({
    where: { project_id: projectId },
  });

  if (existingDelivery) {
    throw new apiError(
      400,
      "Delivery already submitted. Wait for client's review."
    );
  }

  const delivery = await project_delivery.create({
    project_id: projectId,
    freelancer_id: req.user.id,
    text_note,
    file_url: fileUrl,
    status: "delivered",
  });

  // Update project + proposal status
  await project.update({ status: "in-review" });
  await freelancerProposal.update({ status: "awaiting_payment" });

  res
    .status(200)
    .json(new apiResponse(200, delivery, "Project delivered for review"));
});

// client Accepted delivery
const accepteDelivery = asyncHandler(async (req, res) => {
  const { projectId } = req.params;

  const project = await projects.findByPk(projectId);
  if (!project) {
    throw new apiError(404, "Project not found");
  }

  if (req.user.role !== "client" || req.user.id !== project.client_id) {
    throw new apiError(403, "Only client can accepted project");
  }

  // Update delivery status
  const delivery = await project_delivery.findOne({
    where: { project_id: projectId },
  });

  if (!delivery) {
    throw new apiError(404, "No delivery found for this project");
  }

  await delivery.update({ status: "accepted" });
  // Move project to awaiting payment
  await project.update({ status: "awaiting_payment" });

  res
    .status(200)
    .json(
      new apiResponse(
        200,
        { project, delivery },
        "Delivery accepted. Please proceed to payment."
      )
    );
});

export { deliveryProject, accepteDelivery };
