import axios from "axios";

const SERV_API = "https://api.saijo-denki.com";

const user_info = async (token) => {
  return await axios({
    url: SERV_API + "/v1/technician/info",
    method: "GET",
    timeout: 5000,
    headers: {
      Accept: "application/json",
      Authorization: token,
    },
  });
};

const update_user_info = async (
  token,
  userID = 0,
  firstName = "",
  lastName = "",
  phoneNumber = "",
  profileImage = null,
  address = "",
  district = "",
  province = "",
  postal_code = "",
  latitude = "",
  longitude = "",
  idCardFront = null,
  idCardBack = null,
  bookBank = null
) => {
  const formData = new FormData();
  formData.append("name", firstName);
  formData.append("lastname", lastName);
  formData.append("tel", phoneNumber);
  formData.append(
    "profile_img",
    profileImage
      ? {
          uri: profileImage,
          type: "image/jpeg",
          name: userID + ".jpg",
        }
      : null
  );
  formData.append("address", address);
  formData.append("district", district);
  formData.append("province", province);
  formData.append("postal_code", postal_code);
  formData.append("latitude", latitude);
  formData.append("longitude", longitude);
  formData.append(
    "id_card_front",
    idCardFront
      ? {
          uri: idCardFront,
          type: "image/jpeg",
          name: userID + ".jpg",
        }
      : null
  );
  formData.append(
    "id_card_back",
    idCardBack
      ? {
          uri: idCardBack,
          type: "image/jpeg",
          name: userID + ".jpg",
        }
      : null
  );
  formData.append(
    "book_bank",
    bookBank
      ? {
          uri: bookBank,
          type: "image/jpeg",
          name: userID + ".jpg",
        }
      : null
  );

  return await axios({
    url: SERV_API + "/v1/technician/info",
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

const certification_info = async (token) => {
  return await axios({
    url: SERV_API + "/v1/user/certification_info",
    method: "GET",
    timeout: 5000,
    headers: {
      Accept: "application/json",
      Authorization: token,
    },
  });
};

export { user_info, update_user_info, certification_info };
