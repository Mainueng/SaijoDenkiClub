import axios from "axios";

const SERV_API = "https://api.saijo-denki.com";

const errors = async (token) => {
  return await axios({
    url: SERV_API + "/v1/technician/errors",
    method: "GET",
    timeout: 5000,
    headers: {
      Accept: "application/json",
      Authorization: token,
    },
  });
};

const errorInfo = async (token, job_id) => {
  return await axios({
    url: SERV_API + "/v1/technician/error/" + job_id,
    method: "GET",
    timeout: 5000,
    headers: {
      Accept: "application/json",
      Authorization: token,
    },
  });
};

export { errors, errorInfo };
