export const asyncActionCreator = (baseName) => ({
  action: `${baseName}`,
  request: `${baseName}_REQUEST`,
  success: `${baseName}_SUCCESS`,
  failure: `${baseName}_FAILURE`,
});
