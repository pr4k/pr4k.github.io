// Fetch the move history (stored in memory)
export const get = async () => {
  return {
    body: JSON.stringify(moveLog) // Return the move log stored in memory
  }
}
