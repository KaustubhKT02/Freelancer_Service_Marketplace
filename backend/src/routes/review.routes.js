import express from "express";
import { verifyJWT } from "../middlewares/auth.middlewares.js";
import { roleAuth } from "../middlewares/roleAuth.middleware.js";
import {
  createReview,
  getProjectReview,
  getReview,
} from "../controllers/review.controllers.js";

const reviewRoutes = express.Router();

reviewRoutes
  .route("/create/:projectId")
  .post(verifyJWT, roleAuth("client"), createReview);
reviewRoutes.route("/freelancer/:freelancerId").get(getReview);
reviewRoutes.route("/project/:projectId").get(getProjectReview);

export default reviewRoutes;
