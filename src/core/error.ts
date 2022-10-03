export const errors = {
  0: 'state must be an object',
  1: 'state is read only outside of actions; state value only can be changed in actions',
  2: 'no such type of store',
  3: '@IEntityName-decorator can only be used to decorate a parameter',
};

export const throwError = (errNum: keyof typeof errors, extraMsg?: string) => {
  throw new Error(errors[errNum] + ' ' + extraMsg);
};
