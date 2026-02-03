import api from "./api";

/* -------- ADMIN : GET ALL ADOPTIONS -------- */
export const getAllAdoptions = () => {
  return api.get("/api/adoptions");
};

/* -------- ADMIN : UPDATE STATUS -------- */
export const updateAdoptionStatus = (id, status) => {
  return api.put(`/api/adoptions/${id}/status`, null, {
    params: { status },
  });
};
