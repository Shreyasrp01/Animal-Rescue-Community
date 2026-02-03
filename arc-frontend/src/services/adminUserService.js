import api from "./api";

/* -------- ADMIN : GET USERS -------- */
export const getAllUsers = () => {
  return api.get("/api/admin/users");
};

/* -------- ADMIN : UPDATE ROLE -------- */
export const updateUserRole = (id, role) => {
  return api.put(`/api/admin/users/${id}/role`, null, {
    params: { role },
  });
};

/* -------- ADMIN : DELETE USER -------- */
export const deleteUser = (id) => {
  return api.delete(`/api/admin/users/${id}`);
};

