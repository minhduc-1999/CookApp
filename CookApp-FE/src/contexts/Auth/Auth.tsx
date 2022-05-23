import { Credential, login } from "apis/auth";
import { LoginResponse } from "apis/base.type";
import { createContext, useContext, useState } from "react";
import { Redirect, Route } from "react-router-dom";

interface AuthContextType {
  user: LoginResponse | null;
  signIn: (cre: Credential, cb: () => void) => Promise<void>;
  signOut: (cb: () => void) => Promise<void>;
}

const authContext = createContext<AuthContextType | null>(null);

export const useAuth = () => {
  return useContext(authContext);
};

export const useAuthUser = () => {
  const getUser = (): LoginResponse | null => {
    const rawAuth = sessionStorage.getItem("auth");
    if (rawAuth) return JSON.parse(rawAuth);
    return null;
  };
  const [user, setUser] = useState<LoginResponse | null>(getUser());
  const saveUser = (authUser: LoginResponse | null) => {
    sessionStorage.setItem("auth", JSON.stringify(authUser));
    setUser(authUser);
  };
  return { user, setUser: saveUser };
};

const useProvideAuth = () => {
  const { user, setUser } = useAuthUser();
  const signIn = async (cre: Credential, cb: () => void) => {
    const response = await login(cre);
    setUser(response);
    cb();
  };
  const signOut = async (cb: () => void) => {
    setUser(null);
    cb();
  };
  return {
    user,
    signIn,
    signOut,
  };
};

export const ProvideAuth = (props: any) => {
  const auth = useProvideAuth();
  return (
    <authContext.Provider value={auth}>{props.children}</authContext.Provider>
  );
};

type PrivateRouteProps = {
  path: string;
  component: React.FC;
};

export function PrivateRoute(props: PrivateRouteProps) {
  const auth = useAuth();
  return auth?.user ? (
    <Route path={props.path} component={props.component} />
  ) : (
    <Route
      path={props.path}
      render={({ location }) => (
        <Redirect
          to={{
            pathname: "/auth/login",
            state: { from: location },
          }}
        />
      )}
    />
  );
}
