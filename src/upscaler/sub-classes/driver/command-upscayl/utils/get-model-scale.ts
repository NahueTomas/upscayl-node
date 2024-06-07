export const getModelScale = (modelName: string): number => {
  const modelNameLower = modelName.toLowerCase();
  let initialScale = 4;
  if (modelNameLower.includes('x2') || modelNameLower.includes('2x')) {
    initialScale = 2;
  } else if (modelNameLower.includes('x3') || modelNameLower.includes('3x')) {
    initialScale = 3;
  } else {
    initialScale = 4;
  }
  return initialScale;
};
