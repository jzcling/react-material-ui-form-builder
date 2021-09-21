import cloneDeep from "lodash/cloneDeep";

export function shuffleArray(array) {
  const copy = cloneDeep(array);
  for (let i = copy.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [copy[i], copy[j]] = [copy[j], copy[i]];
  }
  return copy;
}

export const getValidationType = (field) => {
  if (!field.component || field.component === "text-field") {
    if (field.props?.type === "number") {
      return "number";
    }
  }
  if (field.multiple || field.props?.multiple) {
    return "array";
  }
  if (field.validationType) {
    return field.validationType;
  }
  if (!field.component || field.component === "text-field") {
    return "string";
  }
  return "mixed";
};
