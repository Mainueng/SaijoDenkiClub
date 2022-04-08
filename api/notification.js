import axios from "axios";

const SERV_API = "https://api.saijo-denki.com";

const notifications = async (token) => {
  return await axios({
    url: SERV_API + "/v1/technician/notifications",
    method: "GET",
    timeout: 5000,
    headers: {
      Accept: "application/json",
      Authorization: token,
    },
  });
};

const read_all = async (token, type) => {
  return await axios({
    url: SERV_API + "/v1/technician/notification/" + type,
    method: "PUT",
    timeout: 5000,
    headers: {
      Accept: "application/json",
      Authorization: token,
    },
  });
};

const read = async (token, job_id) => {
  return await axios({
    url: SERV_API + "/v1/technician/notification/read/" + job_id,
    method: "PUT",
    timeout: 5000,
    headers: {
      Accept: "application/json",
      Authorization: token,
    },
  });
};

const remove = async (token, job_id) => {
  return await axios({
    url: SERV_API + "/v1/technician/notification/remove/" + job_id,
    method: "DELETE",
    timeout: 5000,
    headers: {
      Accept: "application/json",
      Authorization: token,
    },
  });
};

export { notifications, read_all, read, remove };