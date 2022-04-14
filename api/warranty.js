import axios from "axios";

const SERV_API = "https://api.saijo-denki.com";

const warranty_validate = async (token, serial) => {
  const formData = new FormData();
  formData.append("serial", serial);

  return await axios({
    url: SERV_API + "/v1/technician/ewarranty/validate",
    method: "POST",
    data: formData,
    //timeout: 15000,
    headers: {
      Accept: "application/json",
      "Content-Type": "multipart/form-data",
      Authorization: token,
    },
  });
};

const warranty_info = async (token, indoor_serial, outdoor_serial) => {
  const formData = new FormData();
  formData.append("indoor_serial", indoor_serial);
  formData.append("outdoor_serial", outdoor_serial);

  return await axios({
    url: SERV_API + "/v1/technician/ewarranty/warranty_info",
    method: "POST",
    data: formData,
    timeout: 5000,
    headers: {
      Accept: "application/json",
      "Content-Type": "multipart/form-data",
      Authorization: token,
    },
  });
};

export { warranty_validate, warranty_info };
