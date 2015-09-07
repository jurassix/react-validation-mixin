
export default function isSome(item, ...tests) {
  if (Array.isArray(tests)) {
    return tests.some(test => item === test);
  }
  return false;
}
