import axios from "axios";

const SERV_API = "https://api.saijo-denki.com";

const user_info = async (token) => {
  return await axios({
    url: SERV_API + "/v1/technician/info",
    method: "GET",
    timeout: 5000,
    headers: {
      Accept: "application/json",
      "Content-Type": "multipart/form-data",
      Authorization: token,
    },
  });
};

export { user_info };
