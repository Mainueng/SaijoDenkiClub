import axios from "axios";

const SERV_API = "https://api.saijo-denki.com";

const sign_in = async (username, password, device_id) => {
  const formData = new FormData();
  formData.append("email", username);
  formData.append("password", password);
  formData.append("device_id", device_id);

  return await axios({
    url: SERV_API + "/v1/technician/login",
    method: "POST",
    data: formData,
    timeout: 5000,
    headers: {
      Accept: "application/json",
      "Content-Type": "multipart/form-data",
    },
  });
};

const sign_up = async (
  first_name,
  last_name,
  email,
  phone_number,
  password,
  device_id
) => {
  const formData = new FormData();
  formData.append("name", first_name);
  formData.append("lastname", last_name);
  formData.append("email", email);
  formData.append("telephone", phone_number);
  formData.append("password", password);
  formData.append("device_id", device_id);

  return await axios({
    url: SERV_API + "/v1/auth",
    method: "POST",
    data: formData,
    timeout: 5000,
    headers: {
      Accept: "application/json",
      "Content-Type": "multipart/form-data",
    },
  });
};

const forgot_password = async (email) => {
  const formData = new FormData();
  formData.append("email", email);

  return await axios({
    url: SERV_API + "/v1/forgot_password_core",
    method: "POST",
    data: formData,
    timeout: 5000,
    headers: {
      Accept: "application/json",
      "Content-Type": "multipart/form-data",
    },
  });
};

const facebook_auth = async (fb_token, device_id) => {
  const formData = new FormData();
  formData.append("fb_token", fb_token);
  formData.append("device_id", device_id);

  return await axios({
    url: SERV_API + "/v1/auth/login_facebook",
    method: "POST",
    data: formData,
    timeout: 5000,
    headers: {
      Accept: "application/json",
      "Content-Type": "multipart/form-data",
    },
  });
};

const apple_auth = async (email, name, lastname, device_id) => {
  const formData = new FormData();
  formData.append("email", email);
  formData.append("name", name);
  formData.append("lastname", lastname);
  formData.append("device_id", device_id);

  return await axios({
    url: SERV_API + "/v1/auth/login_apple",
    method: "POST",
    data: formData,
    timeout: 5000,
    headers: {
      Accept: "application/json",
      "Content-Type": "multipart/form-data",
    },
  });
};

const check_version = async (os, version) => {
  const formData = new FormData();
  formData.append("app", "core");
  formData.append("device", os);
  formData.append("version", version);

  return await axios({
    url: SERV_API + "/v1/check_version",
    method: "POST",
    data: formData,
    timeout: 5000,
    headers: {
      Accept: "application/json",
      "Content-Type": "multipart/form-data",
    },
  });
};

export {
  sign_in,
  sign_up,
  forgot_password,
  facebook_auth,
  apple_auth,
  check_version,
};
