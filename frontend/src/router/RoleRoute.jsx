import { Navigate } from "react-router-dom";
import useAuthStore from "../context/authStore.context";
import { Children } from "react";


const RoleRoute = ({ Children, allowedRoles}) => {
    const {user, loading} = useAuthStore();

    if(!user || !allowedRoles.includes(user.role)) {
        return <Navigate to='/dashboard'/>
    } {
        return Children;
    }
}

export default RoleRoute