import { freelancer_accounts } from "../models/models.js";
import { apiError, apiResponse, asyncHandler } from "../utils/utils.js";

// create and update freelancer Upi/bank details
const addFreelancerAccount = asyncHandler(async (req, res) => {
  if (req.user.role !== "freelancer") {
    throw new apiError(400, "Only freelancers can update payment info");
  }

  const { upi_id, account_holder_name, bank_name, account_number, ifsc_code } =
    req.body;

  if (!upi_id && !account_number) {
    throw new apiError(400, "Either UPI ID or Account Number is required");
  }

  if (!account_holder_name) {
    throw new apiError(400, "Account Holder Name is required");
  }

  const existing = await freelancer_accounts.findOne({
    where: { user_id: req.user.id },
  });

  if (existing) {
    await existing.update({
      upi_id,
      account_holder_name,
      bank_name: bank_name || existing.bank_name,
      account_number,
      ifsc_code,
    });

    return res
      .status(200)
      .json(
        new apiResponse(
          200,
          existing,
          "Freelancer payment info updated successfully"
        )
      );
  }

  const newAccount = await freelancer_accounts.create({
    user_id: req.user.id,
    upi_id,
    account_holder_name,
    bank_name,
    account_number,
    ifsc_code,
  });

  res
    .status(201)
    .json(
      new apiResponse(
        201,
        account,
        "Freelancer payment info added successfully"
      )
    );
});

export { addFreelancerAccount };
