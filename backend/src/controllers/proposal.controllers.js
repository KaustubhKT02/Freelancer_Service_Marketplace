import {users, projects, proposals} from '../models/models.js';
import { asyncHandler, apiError, apiResponse} from '../utils/utils.js';

// Send Proposal to projec (client only)

const sendProposal = asyncHandler(async(requestAnimationFrame, res)=> {
    const {project_id, cover_letter, bid_amount} = req.body;

    if(req.user?.role !== 'freelancer') {
        throw new apiError(403, "Only Freelancers can submit proposals");
    }

   const project = await projects.findByPk(project_id);
   if(!project) {
    throw new apiError(404, "Project not found");
   }

   const existing = await proposals.findOne({
    where: {
        project_id, freelancer_id: req.user?.id
    },
   });

   if(existing) {
    throw new apiResponse(400, "You already submitted a proposal for this project")
   }

   const  proposal =  await proposals.create({
    project_id,
    freelancer_id: req.user?.id,
    bid_amount,
    cover_letter,
});

res.status(200).json(new apiResponse(200, proposal , "propsal submited successfully."))
});







export {}
