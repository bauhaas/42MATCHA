import { Navigate, Outlet } from "react-router-dom";

export const ProtectedLayout = () => {

    const token = localStorage.getItem("jwt");

    console.log('protected layout');
    if (!token) {
        return <Navigate to="/signin" />;
    }

    return (
        <>
            <Outlet />
        </>
    )
};