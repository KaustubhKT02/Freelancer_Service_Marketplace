import RazorPay from "razorepay";
import crypto from "crypto";
import { payments, projects, proposals } from "../models/models.js";
import { asyncHandler, apiError, apiResponse } from "../utils/utils.js";
import { json } from "body-parser";
import { where } from "sequelize";

// RazorPay instance
const razorepay = new RazorPay({
  key_id: process.env.REZORPAY_KEY_ID,
  key_secret: process.env.REZORPAY_KEY_SECRET,
});

//  Create RazorPay Order (Client fund project)

const createOrder = asyncHandler(async (req, res) => {
  // Get project id from user
  const { projectID } = req.params;

  // get amount from body
  const { amount } = req.body;
  // validate amount
  if (!amount) {
    throw new apiError(400, "Amount is required");
  }
  // check project is available or not
  const project = await projects.findByPk(projectID);
  if (!project) {
    throw new apiError(404, "Project not found");
  }
  // check only client can pay
  if (project.client_id !== req.user?.id) {
    throw new apiError(403, "You are not authorized to fund this project");
  }
  // create order
  const order = await razorepay.orders.create({
    amount: amount * 100, // in paisa
    currency: "INR",
    receipt: `project_${projectID}_${Date.now()}`,
    payment_capture: 1,
  });
  // Save db
  const payment = await payments.create({
    razorpay_order_id: order.id,
    amount: amount * 100,
    currency: "INR",
    status: "created",
    project_id: projectID,
    client_id: req.user.id,
  });

  res
    .status(200)
    .json(
      new apiResponse(
        200,
        { order, payment },
        "Payment order created Successfully"
      )
    );
});

// Verify razorpay web hook(auto triggered)

const handleWebhoolk = asyncHandler(async (req, res) => {
  const secret = process.env.REZORPAY_WEBHOOK_SECRET;

  // Verify signature
  const signature = req.headers["x-razorpay-signature"];
  const shasum = crypto.createHmac("sha256", secret);
  shasum.update(JSON.stringify(req.body));
  const digest = shasum.digest("hex");

  if (digest !== signature) {
    throw new apiError(400, "Invalid signature verification");
  }

  const event = req.body.event;
  const paymentEntity = req.body.payload.payment.entity;

  if (event === "payment.captured") {
    const payment = await payments.findOne({
      where: { razorpay_order_id: paymentEntity.order_id },
    });

    if (payment) {
      await payment.update({
        status: "captured",
        razorpay_payment_id: paymentEntity.id,
      });

      await payments.update(
        { status: "in progress" },
        {
          where: {
            id: payment.project_id,
          },
        }
      );
    }
  }

  res.status(200).json({ recevied: true });
});

export { createOrder, handleWebhoolk};
