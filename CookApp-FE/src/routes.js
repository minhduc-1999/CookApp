// import
import Dashboard from "views/Dashboard/Dashboard";
import Tables from "views/Dashboard/Tables";
import Billing from "views/Dashboard/Billing";
import Profile from "views/Dashboard/Profile";
import SignUp from "views/Pages/SignUp";
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

var dashRoutes = [
  {
    path: "/dashboard",
    name: "Dashboard",
    icon: <HomeIcon color="inherit" />,
    component: Dashboard,
    layout: "/admin",
  },
  {
    path: "/censorship",
    name: "Censorship",
    icon: <StatsIcon color="inherit" />,
    component: Censorship,
    layout: "/admin",
  },
  {
    path: "/tables",
    name: "Tables",
    icon: <StatsIcon color="inherit" />,
    component: Tables,
    layout: "/admin",
  },
  {
    path: "/billing",
    name: "Billing",
    icon: <CreditIcon color="inherit" />,
    component: Billing,
    layout: "/admin",
  },
  {
    name: "MANAGEMENT",
    category: "account",
    state: "pageCollapse",
    views: [
      {
        path: "/posts",
        name: "Post",
        icon: <PersonIcon color="inherit" />,
        secondaryNavbar: true,
        component: Profile,
        layout: "/admin",
      },
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
        name: "Other settings",
        icon: <DocumentIcon color="inherit" />,
        component: OtherSetting,
        layout: "/admin",
      },
      {
        path: "/signup",
        name: "Sign Up",
        icon: <RocketIcon color="inherit" />,
        secondaryNavbar: true,
        component: SignUp,
        layout: "/auth",
      },
    ],
  },
];
export default dashRoutes;
