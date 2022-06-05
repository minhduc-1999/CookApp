// import
import Dashboard from "views/Dashboard/Dashboard";
import Billing from "views/Dashboard/Billing";
import Profile from "views/Dashboard/Profile";
import SignIn from "views/Pages/SignIn";
import Users from "views/Dashboard/Users";
import Foods from "views/Dashboard/Foods";
import {
  HomeIcon,
  StatsIcon,
  CreditIcon,
  PersonIcon,
  DocumentIcon,
  RocketIcon,
} from "components/Icons/Icons";
import OtherSetting from "views/Dashboard/OtherSetting";
import Censorship from "views/Dashboard/Censorship";

export const dashRoutes = [
  // {
  //   path: "/dashboard",
  //   name: "Dashboard",
  //   icon: <HomeIcon color="inherit" />,
  //   component: Dashboard,
  //   layout: "/admin",
  // },
  {
    path: "/censorship",
    name: "Censorship",
    icon: <StatsIcon color="inherit" />,
    component: Censorship,
    layout: "/admin",
  },
  {
    name: "MANAGEMENT",
    category: "account",
    state: "pageCollapse",
    views: [
      {
        path: "/foods",
        name: "Food",
        icon: <DocumentIcon color="inherit" />,
        component: Foods,
        layout: "/admin",
      },
      {
        path: "/users",
        name: "Users",
        icon: <DocumentIcon color="inherit" />,
        component: Users,
        layout: "/admin",
      },
      {
        path: "/others",
        name: "System settings",
        icon: <DocumentIcon color="inherit" />,
        component: OtherSetting,
        layout: "/admin",
      },
    ],
  },
  {
    name: "OTHER",
    category: "account",
    state: "pageCollapse",
    views: [
      {
        path: "/profile",
        name: "Profile",
        icon: <DocumentIcon color="inherit" />,
        component: Profile,
        layout: "/admin",
      }
    ],
  },
];

export const authRoutes = [
  {
    path: "/login",
    name: "Sign In",
    component: SignIn,
    layout: "/auth",
  },
];
