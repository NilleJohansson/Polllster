import React, {
  createContext,
  ReactNode,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react";
import { useNavigate, useLocation } from "react-router-dom";
import * as usersApi from "../api/users";
import { User } from "../datatypes/User";
import useApiClient from "../api/ApiClient";
import { AxiosError } from "axios";

interface AuthContextType {
  // We defined the user type in `index.d.ts`, but it's
  // a simple object with email, name and password.
  user?: User;
  loading: boolean;
  error?: unknown;
  login: (email: string, password: string) => boolean;
  signUp: (email: string, name: string, password: string) => string;
  logout: () => void;
  refreshToken: () => void;
}

const AuthContext = createContext<AuthContextType>({} as AuthContextType);

// Export the provider as we need to wrap the entire app with it
export function AuthProvider({
  children,
}: {
  children: ReactNode;
}): JSX.Element {
  const [error, setError] = useState<unknown>();
  const [loading, setLoading] = useState<boolean>(false);
  const [loadingInitial, setLoadingInitial] = useState<boolean>(true);

  //const [user, setUser] = useLocalStorage("user", localStorage.getItem('user'));
  const apiClient = useApiClient("http://localhost:8080/api/auth/");
  const [user, setUser] = useState<User | null>(null);

  // We are using `react-router` for this example,
  // but feel free to omit this or use the
  // router of your choice.
  const navigate = useNavigate();
  const location = useLocation();

  // Reset the error state if we change page
  useEffect(() => {
    if (error) setError(undefined);
  }, [location.pathname]);

  // Check if there is a currently active session
  // when the provider is mounted for the first time.
  //
  // If there is an error, it means there is no session.
  //
  // Finally, just signal the component that the initial load
  // is over.
  useEffect(() => {
    usersApi
      .getCurrentUser()
      .then((user) => setUser(user))
      .catch((_error) => {
        console.log(_error);
      })
      .finally(() => setLoadingInitial(false));
  }, []);

  // Flags the component loading state and posts the login
  // data to the server.
  //
  // An error means that the email/password combination is
  // not valid.
  //
  // Finally, just signal the component that loading the
  // loading state is over.
  async function login(email: string, password: string): Promise<boolean> {
    setLoading(true);
    let response;
    try {
     response = await apiClient.post<User>("signin", { email, password }, {
      withCredentials: true
    }); 
    } catch (err) {
      console.log("Login error", err);
      
      return false;
    }

    const user = {
      email: response.data.email,
      username: response.data.username,
      accessToken: response.data.accessToken,
    } as User;

    setUser(user);
    navigate("/createNewPoll");
    setLoading(false);
    return true;
  }

  // Sends sign up details to the server. On success we just apply
  // the created user to the state.
  async function signUp(email: string, name: string, password: string): Promise<string> {
    setLoading(true);

    let response;
    try {
     response = await apiClient.post<User>("signup", { email, username: name, password });
    } catch (err: unknown) {
      console.log("err", err);
      return err.response?.data?.message as string;
    }

    const user = {
      email: response.data.email,
      username: response.data.username,
      accessToken: response.data.accessToken,
    } as User;

    setUser(user);
    navigate("/createNewPoll");
    setLoading(false);
    return "";
  }

  // Call the refresh token endpoint and to retrieve a new access token
  async function refreshToken() {
    console.log("Refresh token call");
    
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const response = await apiClient.post<any>("refreshtoken",{}, {
      withCredentials: true
    });

    const user = {
      email: response.data.email,
      username: response.data.username,
      accessToken: response.data.accessToken,
    } as User;

    setUser(user);
    navigate("/");
  }

  // Call the logout endpoint and then remove the user
  // from the state.
  function logout() {
    const response = apiClient.post<User>("signout");
    console.log("Logout", response);
    setUser(null);
    navigate("/");
  }

  // Make the provider update only when it should.
  // We only want to force re-renders if the user,
  // loading or error states change.
  //
  // Whenever the `value` passed into a provider changes,
  // the whole tree under the provider re-renders, and
  // that can be very costly! Even in this case, where
  // you only get re-renders when logging in and out
  // we want to keep things very performant.
  const memoedValue = useMemo(
    () => ({
      user,
      loading,
      error,
      login,
      signUp,
      logout,
      refreshToken,
    }),
    [user, loading, error]
  );

  // We only want to render the underlying app after we
  // assert for the presence of a current user.
  return (
    <AuthContext.Provider value={memoedValue}>
      {!loadingInitial && children}
    </AuthContext.Provider>
  );
}

// Let's only export the `useAuth` hook instead of the context.
// We only want to use the hook directly and never the context component.
export default function useAuth() {
  return useContext(AuthContext);
}
