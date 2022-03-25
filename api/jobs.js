import axios from "axios";

const SERV_API = "https://api.saijo-denki.com";

const upcoming = async (token) => {
  return await axios({
    url: SERV_API + "/v1/jobs",
    method: "GET",
    timeout: 5000,
    headers: {
      Accept: "application/json",
      "Content-Type": "multipart/form-data",
      Authorization: token,
    },
  });
};

const recommend = async (token) => {
  return await axios({
    url: SERV_API + "/v1/jobs/recommend",
    method: "GET",
    timeout: 5000,
    headers: {
      Accept: "application/json",
      "Content-Type": "multipart/form-data",
      Authorization: token,
    },
  });
};

const history = async (token) => {
  return await axios({
    url: SERV_API + "/v1/jobs/history",
    method: "GET",
    timeout: 5000,
    headers: {
      Accept: "application/json",
      "Content-Type": "multipart/form-data",
      Authorization: token,
    },
  });
};

const jobInfo = async (token, job_id) => {
  return await axios({
    url: SERV_API + "/v1/jobs/job_info/" + job_id,
    method: "GET",
    timeout: 5000,
    headers: {
      Accept: "application/json",
      "Content-Type": "multipart/form-data",
      Authorization: token,
    },
  });
};

export { upcoming, recommend, history, jobInfo };
