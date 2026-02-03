import api from "./api";

/* -------- GET ALL ANIMALS -------- */
export const getAllAnimals = () => {
  return api.get("/api/animals");
};

/* -------- UPDATE ANIMAL STATUS (ADMIN) -------- */
export const updateAnimalStatus = (id, status) => {
  return api.put(`/api/animals/${id}/status`, null, {
    params: {
      status: String(status),
    },
  });
};

/* -------- DELETE ANIMAL -------- */
export const deleteAnimal = (id) => {
  return api.delete(`/api/animals/${id}`);
};



