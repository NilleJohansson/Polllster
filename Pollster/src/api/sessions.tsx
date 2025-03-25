// import { User } from "../datatypes/User";
// import useApiClient from "./ApiClient";

// export async function login({ email, password, apiClient }): Promise<User> {
//   const apiClient = useApiClient("http://localhost:8080/api/auth/");

//   const response = await apiClient.post<User>("signin", { email, password });
//   // TODO: Do API call
//   //   const response = await redaxios.post("/api/sessions", { session: params });
//   console.log("Response", response);

//   return {
//     email: response.data.email,
//     username: response.data.username,
//     accessToken: response.data.accessToken,
//   } as User;
// }

// export async function refreshToken() {
//     const apiClient = useApiClient("http://localhost:8080/api/auth/");

//   let response;
//   try {
//     // eslint-disable-next-line @typescript-eslint/no-explicit-any
//     response = await apiClient.post<any>("refreshtoken");
//   } catch (err) {
//     console.log(err);
//   }

//   console.log("Refresh token response", response);

//   return "";
// }

// export async function logout() {
//   const apiClient = useApiClient("http://localhost:8080/api/auth/");

//   console.log("Log out");
//   let response;
//   try {
//     response = await apiClient.post<User>("signout");
//   } catch (err) {
//     console.log(err);
//   }

//   console.log(response);

//   return "";
// }
