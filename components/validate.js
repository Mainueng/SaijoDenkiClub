const validateEmail = (email) => {
  var re = /\S+@\S+\.\S+/;
  return re.test(email);
};

const validatePhoneNumber = (phone_number) => {
  var re =
    /^[(]{0,1}[0-9]{3}[)]{0,1}[-\s\.]{0,1}[0-9]{3}[-\s\.]{0,1}[0-9]{3,4}$/;
  return re.test(phone_number);
};

export { validateEmail, validatePhoneNumber };
