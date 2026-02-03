import api from "./api";

export const registerUser = (data) => {
  return api.post("/api/auth/signup", data);
};

export const loginUser = (data) => {
  return api.post("/api/auth/login", data);
};
