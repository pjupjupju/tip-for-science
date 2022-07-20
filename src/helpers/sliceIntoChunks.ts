function sliceIntoChunks(arr: any[], chunkSize: number) {
  if (chunkSize < 1 || chunkSize % 1 !== 0) {
    throw new Error('Chunk size must be a positive, non-zero integer.');
  }

  const res = [];
  for (let i = 0; i < arr.length; i += chunkSize) {
    const chunk = arr.slice(i, i + chunkSize);
    res.push(chunk);
  }
  return res;
}

export { sliceIntoChunks };
