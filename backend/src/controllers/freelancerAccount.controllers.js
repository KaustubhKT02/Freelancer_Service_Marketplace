
import {freelancer_accounts} from '../models/models.js';
import {apiError, apiResponse, asyncHandler} from '../utils/utils.js';



// create and update freelancer Upi/bank details
const addFreelancerAccount = asyncHandler(async(req, res)=> {
    if(req.user?.role !== 'freelancer' && req.user?.id !== freelancer_accounts.user_id ) {
        throw new apiError(400, "Only freelancers can update payment info");
    }

    const {upi_id, account_holder_name, bank_name, account_number, ifsc_code} =req.body;

    if(!upi_id || !account_number) {
        throw new apiError(400, "UPI ID or Account Number is required");
    };

   const existing = await freelancer_accounts.findOne({where: {user_id: req.user?.id}});

   if(existing) {
    await existing.update({
        upi_id,
        account_holder_name,
        account_number,
        ifsc_code,
        bank_name
    })

    return res.status(200).json(new apiResponse(200, existing, "Freelancer payment info updated"))
   }

   const account =  await freelancer_accounts.create({
    user_id: req.user.id,
    upi_id,
    account_holder_name,
    bank_name,
    account_number,
    ifsc_code
   })

   res.status(200).json(new apiResponse(200, account, "Freelancer Payment info added"));
});


export {addFreelancerAccount};

