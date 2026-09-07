import api from "./api";

export const authService = {
  login: (email, password) =>
    api.post("/auth/login", { email, password }).then((res) => res.data.data),
  me: () => api.get("/auth/me").then((res) => res.data.data),
};

export const visitService = {
  create: (payload) => api.post("/visits", payload).then((res) => res.data.data),
  list: (params = {}) => api.get("/visits", { params }).then((res) => res.data),
};

export const visitorService = {
  lookup: (params) => api.get("/visitors/lookup", { params }).then((res) => res.data.data),
};

export const otpService = {
  send: (email) => api.post("/otp/send", { email }).then((res) => res.data),
  verify: (email, code) => api.post("/otp/verify", { email, code }).then((res) => res.data),
};