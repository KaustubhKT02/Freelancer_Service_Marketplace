import {notification} from '../models/models.js';
import {apiError, apiResponse, asyncHandler} from '../utils/utils.js';


const getnotification = asyncHandler(async (req, res)=> {
    const list = await notification.findAll({
        where : {
            user_id: req.user.id
        },
        order: [["createdAt", "DESC"]]
    });

    res.status(200).json(new apiResponse(200, list, "Notification fetched"));
});

//  mark read

const markAsRead = asyncHandler(async (req, res)=> {
    const {userId} = req.params;
     const noti = await notification.findByPk(userId);
     if(!noti) {
        throw new apiError(404, "Notification not found");
     }
     if(noti.user_id !== req.user.id) {
        throw new apiError(403, "Not your notification")
     }

     await noti.update({is_read: true})

     res.status(200).json(new apiResponse(200, noti, "Marked as read"))
});

const markAllAsRead = asyncHandler(async(req, res)=> {
    await notification.update({
        is_read: true
    }, {where: {user_id: req.user.id}})

    res.status(200).json(new apiResponse(200, "All notification marked read"));
});


export {getnotification, markAllAsRead, markAsRead}