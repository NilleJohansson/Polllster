import { User } from "../datatypes/User";

export async function getCurrentUser(): Promise<User> {
    // TODO: Do API call to get user
//   const response = await redaxios.get("/api/user");
  const userString = localStorage.getItem('user');
  if (userString) {
    return JSON.parse(userString) as User;
  } else {
    return {} as User;
  }

}

export async function signUp(params: {
  email: string;
  name: string;
  password: string;
}): Promise<User> {
    // TODO: Do API call to sign up user
//   const response = await redaxios.post("/api/user", { user: params });
    console.log(params);

  return {} as User;
}