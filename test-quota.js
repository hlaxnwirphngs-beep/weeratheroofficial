try {
  const largeString = 'a'.repeat(6 * 1024 * 1024); // 6MB
  console.log(largeString.length);
} catch (e) {
  console.log(e);
}
