export function getValidations(field) {
  var validations = {};
  if (field.label) {
    validations.label = field.label;
  }
  validations = { ...validations, ...field.validations };
  return validations;
}
