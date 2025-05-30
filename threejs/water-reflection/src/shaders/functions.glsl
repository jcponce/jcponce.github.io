float inverseLerp(float currentValue, float minValue, float maxValue) {
  return (currentValue - minValue) / (maxValue - minValue);
}

float remap(float currentValue, float inMin, float inMax, float outMin, float outMax) {
  float t = inverseLerp(currentValue, inMin, inMax);
  return mix(outMin, outMax, t);
}