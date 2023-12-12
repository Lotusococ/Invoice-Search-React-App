import { Route } from "react-router-dom";
import { Navigate, Outlet } from "react-router-dom";

import { useAuth } from "src/interface/Firebase/requestAuth";

// Page Import
import { MainPage } from "src/pages/MainPage";

// Layout Imports
import { ConsistencyCheck } from "src/layout/ConsistencyCheck";
import { Dashboard } from "src/layout/Dashboard";
import { MultiSearch } from "src/layout/MultiSearch";
import { SingleSearch } from "src/layout/SingleSearch";
import { Login } from "src/layout/Authentication/Login";
import { Logout } from "src/layout/Authentication/Logout";

// MUI Icons Imports
import DashboardIcon from "@mui/icons-material/Dashboard";
import SearchIcon from "@mui/icons-material/Search";
import GradingIcon from "@mui/icons-material/Grading";
import LoginIcon from "@mui/icons-material/Login";
import LogoutIcon from "@mui/icons-material/Logout";

// routes
const routes = [
    {
        type: "collapse",
        name: "Dashboard",
        key: "dashboard",
        path: "/dashboard",
        icon: <DashboardIcon />,
        element: <Dashboard />,
        noCollapse: true,
        protected: true
    },
    {
        type: "collapse",
        name: "Single Search",
        key: "single-search",
        path: "/single-search",
        icon: <SearchIcon />,
        element: <SingleSearch />,
        noCollapse: true,
        protected: true
    },
    {
        type: "collapse",
        name: "Multi Search",
        key: "multi-search",
        path: "/multi-search",
        icon: <SearchIcon />,
        element: <MultiSearch />,
        noCollapse: true,
        protected: true
    },
    {
        type: "collapse",
        name: "Consistency Check",
        key: "consistency-check",
        path: "/consistency-check",
        icon: <GradingIcon />,
        element: <ConsistencyCheck />,
        noCollapse: true,
        protected: true
    },
    {
        type: "collapse",
        name: "Login",
        key: "login",
        path: "/login",
        icon: <LoginIcon />,
        element: <Login />,
        noCollapse: true,
        protected: false
    },
    {
        type: "collapse",
        name: "Logout",
        key: "logout",
        path: "/logout",
        icon: <LogoutIcon />,
        element: <Logout />,
        noCollapse: true,
        protected: true
    }
];

export default routes;

const PrivateRoute = () => {
    const { user, loading } = useAuth();

    if (loading) {  
        return <div>Loading...</div>;  
    }
    return user ? <Outlet /> : <Navigate to="/login" />;
};

export const renderRoutes = () => (
    <Route path="/" element={<MainPage />}>
        <Route element={<PrivateRoute />}>
            <Route index element={<Dashboard />} />
            {routes.map((route, index) => (
                route.protected ? (
                    <Route key={index} path={route.path} element={route.element} />
                ) : null
            ))}
        </Route>
        <Route path="/login" element={<Login />} />  
        <Route path="/logout" element={<Logout />} />  
    </Route>
);