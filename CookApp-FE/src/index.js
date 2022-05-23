/*!

=========================================================
* Purity UI Dashboard - v1.0.1
=========================================================

* Product Page: https://www.creative-tim.com/product/purity-ui-dashboard
* Copyright 2021 Creative Tim (https://www.creative-tim.com)
* Licensed under MIT (https://github.com/creativetimofficial/purity-ui-dashboard/blob/master/LICENSE.md)

* Design by Creative Tim & Coded by Simmmple

=========================================================

* The above copyright notice and this permission notice shall be included in all copies or substantial portions of the Software.

*/
import React from "react";
import ReactDOM from "react-dom";
import { Route, Switch, Redirect, BrowserRouter } from "react-router-dom";

import AuthLayout from "layouts/Auth.js";
import AdminLayout from "layouts/Admin.js";
import { PrivateRoute, ProvideAuth } from "contexts/Auth/Auth";

ReactDOM.render(
  <ProvideAuth>
    <BrowserRouter>
      <Switch>
        <Route path={`/auth`} component={AuthLayout} />
        <PrivateRoute path={`/admin`} component={AdminLayout}>
        </PrivateRoute>
        <Redirect from={`/`} to="/admin/dashboard" />
      </Switch>
    </BrowserRouter>
  </ProvideAuth>,
  document.getElementById("root")
);
