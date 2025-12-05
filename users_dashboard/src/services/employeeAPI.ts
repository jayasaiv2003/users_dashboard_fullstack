import axios from "axios";

const API_URL = "http://localhost:5000/employees";

export const getEmployees = async () => {
  return axios.get(API_URL);
};

export const addEmployee = async (data: any) => {
  return axios.post(API_URL, data);
};

export const updateEmployee = async (id: number, data: any) => {
  return axios.put(`${API_URL}/${id}`, data);
};

export const deleteEmployee = async (id: number) => {
  return axios.delete(`${API_URL}/${id}`);
};
