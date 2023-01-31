const validateRegisterInput = (
  firstName: string,
  lastName: string,
  email: string,
  password: string,
) => {
  return (
    firstName.length > 0 &&
    lastName.length > 0 &&
    email.length > 0 &&
    password.length > 0
  );
};

const validateLoginInput = (email: string, password: string) => {
  return email.length > 0 && password.length > 0;
};

export { validateRegisterInput, validateLoginInput };
