import express from "express";
import {verifyJWT} from '../middlewares/auth.middlewares.js';
import {roleAuth} from '../middlewares/roleAuth.middleware.js';
import {sendProposal, getProposalForProject, getMyProposals, updatePropsalStatus} from '../controllers/proposal.controllers.js'
const proposalRoutes = express.Router()

proposalRoutes.route('/').post(verifyJWT, roleAuth('freelancer', sendProposal));
proposalRoutes.route('/my').get(verifyJWT, roleAuth('freelancer', getMyProposals));
proposalRoutes.route('/project/:projectId').get(verifyJWT, roleAuth('client'), getProposalForProject);
proposalRoutes.route('/:proposlaId/status').put(verifyJWT, roleAuth('client'), updatePropsalStatus);

export {proposalRoutes}