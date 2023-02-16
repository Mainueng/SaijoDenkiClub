import axios from "axios";
import { Platform } from "react-native";
const SERV_API = "https://api.saijo-denki.com";

const fileType = (string, char) => {
  return string.slice(string.indexOf(char) + 1);
};

const summaryForm = async (token, job_id) => {
  return await axios({
    url: SERV_API + "/v1/summary/" + job_id,
    method: "GET",

    headers: {
      Accept: "application/json",
      "Content-Type": "multipart/form-data",
      Authorization: token,
    },
  });
};

const saveSummaryForm = async (token, job_id, data) => {
  return await axios({
    url: SERV_API + "/v1/summary/" + job_id,
    method: "POST",

    data: data,
    headers: {
      Accept: "application/json",
      "Content-Type": "application/json",
      Authorization: token,
    },
  });
};

const uploadPic = async (
  token,
  job_id,
  serial,
  order,
  before,
  after,
  signature
) => {
  const formData = new FormData();
  formData.append(
    "before",
    before
      ? {
          uri: before,
          type:
            Platform.OS === "android"
              ? "image/.jpeg"
              : "image/" + fileType(before, "."),
          name:
            Platform.OS === "android"
              ? job_id + ".jpeg"
              : job_id + "." + fileType(before, "."),
        }
      : null
  );

  formData.append(
    "after",
    after
      ? {
          uri: after,
          type:
            Platform.OS === "android"
              ? "image/.jpeg"
              : "image/" + fileType(after, "."),
          name:
            Platform.OS === "android"
              ? job_id + ".jpeg"
              : job_id + "." + fileType(after, "."),
        }
      : null
  );

  formData.append(
    "signature",
    signature
      ? {
          uri: signature,
          type: "image/png",
          name: job_id + ".png",
        }
      : null
  );

  return await axios({
    url:
      SERV_API +
      "/v1/summary/upload_pic/" +
      job_id +
      "/" +
      serial +
      "/" +
      order,
    method: "POST",
    timeout: 5000,
    data: formData,
    headers: {
      Accept: "application/json",
      "Content-Type": "multipart/form-data",
      Authorization: token,
    },
  });
};

const uploadInstallPic = async (
  token,
  job_id,
  order,
  before,
  after,
  signature
) => {
  const formData = new FormData();
  formData.append(
    "before",
    before
      ? {
          uri: before,
          type:
            Platform.OS === "android"
              ? "image/.jpeg"
              : "image/" + fileType(before, "."),
          name:
            Platform.OS === "android"
              ? job_id + ".jpeg"
              : job_id + "." + fileType(before, "."),
        }
      : null
  );

  formData.append(
    "after",
    after
      ? {
          uri: after,
          type:
            Platform.OS === "android"
              ? "image/.jpeg"
              : "image/" + fileType(after, "."),
          name:
            Platform.OS === "android"
              ? job_id + ".jpeg"
              : job_id + "." + fileType(after, "."),
        }
      : null
  );

  formData.append(
    "signature",
    signature
      ? {
          uri: signature,
          type: "image/png",
          name: job_id + ".png",
        }
      : null
  );

  return await axios({
    url: SERV_API + "/v1/summary/upload_install_pic/" + job_id + "/" + order,
    method: "POST",
    timeout: 5000,
    data: formData,
    headers: {
      Accept: "application/json",
      "Content-Type": "multipart/form-data",
      Authorization: token,
    },
  });
};

const assessmentForm = async (token, job_id) => {
  return await axios({
    url: SERV_API + "/v1/summary/assessment_form/" + job_id,
    method: "GET",

    headers: {
      Accept: "application/json",
      "Content-Type": "multipart/form-data",
      Authorization: token,
    },
  });
};

const saveAssessmentForm = async (token, job_id, data) => {
  return await axios({
    url: SERV_API + "/v1/summary/assessment_form/" + job_id,
    method: "POST",

    data: data,
    headers: {
      Accept: "application/json",
      "Content-Type": "application/json",
      Authorization: token,
    },
  });
};

const uploadAssessmentSign = async (token, job_id, signature) => {
  const formData = new FormData();
  formData.append(
    "assessment_signature",
    signature
      ? {
          uri: signature,
          type: "image/png",
          name: job_id + ".png",
        }
      : null
  );

  return await axios({
    url: SERV_API + "/v1/summary/upload_assessment_signature/" + job_id,
    method: "POST",

    data: formData,
    headers: {
      Accept: "application/json",
      "Content-Type": "multipart/form-data",
      Authorization: token,
    },
  });
};

const sendInvoice = async (token, job_id) => {
  return await axios({
    url: SERV_API + "/v1/jobs/invoice/" + job_id,
    method: "PUT",

    headers: {
      Accept: "application/json",
      "Content-Type": "multipart/form-data",
      Authorization: token,
    },
  });
};

const invoices = async (token) => {
  return await axios({
    url: SERV_API + "/v1/summary/invoices",
    method: "GET",

    headers: {
      Accept: "application/json",
      "Content-Type": "multipart/form-data",
      Authorization: token,
    },
  });
};

const invoiceInfo = async (token, job_id) => {
  return await axios({
    url: SERV_API + "/v1/summary/invoice/" + job_id,
    method: "GET",

    headers: {
      Accept: "application/json",
      "Content-Type": "multipart/form-data",
      Authorization: token,
    },
  });
};

export {
  summaryForm,
  saveSummaryForm,
  uploadPic,
  uploadInstallPic,
  assessmentForm,
  saveAssessmentForm,
  uploadAssessmentSign,
  sendInvoice,
  invoices,
  invoiceInfo,
};
