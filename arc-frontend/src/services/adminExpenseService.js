import api from "./api";

/* -------- ADMIN : GET EXPENSES -------- */
export const getAllExpenses = () => {
  return api.get("/api/expenses");
};

/* -------- ADMIN : DELETE EXPENSE -------- */
export const deleteExpense = (id) => {
  return api.delete(`/api/expenses/${id}`);
};
