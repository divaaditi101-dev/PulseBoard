import api from "./api.js";

// Create a new poll
export const createPoll = async (pollData) => {
  const { data } = await api.post("/polls", pollData);
  return data;
};

// Get all polls belonging to the logged-in user
export const getMyPolls = async () => {
  const { data } = await api.get("/polls/my");
  return data;
};

// Get a single poll by its public share token (no auth needed)
export const getPollByToken = async (token) => {
  const { data } = await api.get(`/polls/${token}`);
  return data;
};

// Submit a response to a poll
export const submitResponse = async (token, answers) => {
  const payload = Array.isArray(answers) ? { answers } : answers;
  const { data } = await api.post(`/responses/${token}`, payload);
  return data;
};

// Get analytics for a poll
export const getAnalytics = async (pollId) => {
  const { data } = await api.get(`/responses/${pollId}/analytics`);
  return data;
};

// Publish a poll (make it live / close & publish results)
export const publishPoll = async (pollId) => {
  const { data } = await api.put(`/polls/${pollId}/publish`);
  return data;
};

// Delete a poll
export const deletePoll = async (pollId) => {
  const { data } = await api.delete(`/polls/${pollId}`);
  return data;
};
