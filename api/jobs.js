import axios from "axios";

const SERV_API = "https://api.saijo-denki.com";

const upcoming = async (token) => {
  return await axios({
    url: SERV_API + "/v1/jobs",
    method: "GET",

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

    headers: {
      Accept: "application/json",
      "Content-Type": "multipart/form-data",
      Authorization: token,
    },
  });
};

const jobStatusLog = async (token, job_id) => {
  return await axios({
    url: SERV_API + "/v1/jobs/status_log/" + job_id,
    method: "GET",

    headers: {
      Accept: "application/json",
      "Content-Type": "multipart/form-data",
      Authorization: token,
    },
  });
};

const checkIn = async (token, job_id, latitude, longitude) => {
  const formData = new FormData();
  formData.append("job_id", job_id);
  formData.append("latitude", latitude);
  formData.append("longitude", longitude);

  return await axios({
    url: SERV_API + "/v1/jobs/checkin",
    method: "POST",
    data: formData,

    headers: {
      Accept: "application/json",
      "Content-Type": "multipart/form-data",
      Authorization: token,
    },
  });
};

const checkOut = async (token, job_id, latitude, longitude) => {
  const formData = new FormData();
  formData.append("job_id", job_id);
  formData.append("latitude", latitude);
  formData.append("longitude", longitude);

  return await axios({
    url: SERV_API + "/v1/jobs/checkout",
    method: "POST",
    data: formData,

    headers: {
      Accept: "application/json",
      "Content-Type": "multipart/form-data",
      Authorization: token,
    },
  });
};

const acceptJob = async (token, job_id) => {
  return await axios({
    url: SERV_API + "/v1/jobs/job_accept/" + job_id,
    method: "PUT",

    headers: {
      Accept: "application/json",
      "Content-Type": "application/json",
      Authorization: token,
    },
  });
};

const denyJob = async (token, job_id) => {
  return await axios({
    url: SERV_API + "/v1/jobs/deny/" + job_id,
    method: "DELETE",
    headers: {
      Accept: "application/json",
      "Content-Type": "application/json",
      Authorization: token,
    },
  });
};

const summary = async (token) => {
  return await axios({
    url: SERV_API + "/v1/jobs/summary",
    method: "GET",

    headers: {
      Accept: "application/json",
      "Content-Type": "multipart/form-data",
      Authorization: token,
    },
  });
};

const summaryDetail = async (token) => {
  return await axios({
    url: SERV_API + "/v1/jobs/detail-summary",
    method: "GET",

    headers: {
      Accept: "application/json",
      "Content-Type": "multipart/form-data",
      Authorization: token,
    },
  });
};

const summaryDetailSaijo = async (token) => {
  return await axios({
    url: SERV_API + "/v1/jobs/detail-summary-saijo",
    method: "GET",

    headers: {
      Accept: "application/json",
      "Content-Type": "multipart/form-data",
      Authorization: token,
    },
  });
};

const saijoTechnicianInvoice = async (token, job_id) => {
  return await axios({
    url: SERV_API + "/v1/summary/saijo_technician_invoice/" + job_id,
    method: "GET",

    headers: {
      Accept: "application/json",
      "Content-Type": "multipart/form-data",
      Authorization: token,
    },
  });
};

const validateCheckIn = async (token, job_id, appointmentDateTime) => {
  const formData = new FormData();
  formData.append("appointment_datetime", appointmentDateTime);

  return await axios({
    url: SERV_API + "/v1/jobs/validate_checkin/" + job_id,
    method: "POST",
    data: formData,

    headers: {
      Accept: "application/json",
      "Content-Type": "multipart/form-data",
      Authorization: token,
    },
  });
};

const validateCheckOut = async (token, job_id, appointmentDateTime) => {
  const formData = new FormData();
  formData.append("appointment_datetime", appointmentDateTime);

  return await axios({
    url: SERV_API + "/v1/jobs/validate_checkout/" + job_id,
    method: "POST",
    data: formData,

    headers: {
      Accept: "application/json",
      "Content-Type": "multipart/form-data",
      Authorization: token,
    },
  });
};

export {
  upcoming,
  recommend,
  history,
  jobInfo,
  jobStatusLog,
  checkIn,
  checkOut,
  acceptJob,
  denyJob,
  summary,
  summaryDetail,
  summaryDetailSaijo,
  saijoTechnicianInvoice,
  validateCheckIn,
  validateCheckOut,
};
