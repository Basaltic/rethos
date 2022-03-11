export const errors = {
  1: 'state value only can be changed in actions',
};

export const throwError = (errNum: keyof typeof errors) => {
  throw new Error(errors[errNum]);
};
