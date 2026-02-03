import api from "./api";

/* ---------------- GET ALL ANIMALS ---------------- */
export const getAllAnimals = () => {
  return api.get("/api/animals");
};

/* ---------------- REPORT ANIMAL (POST) ---------------- */
export const reportAnimal = (formData) => {
  return api.post("/api/animals", formData, {
    headers: {
      "Content-Type": "multipart/form-data",
    },
  });
};
