// Example API endpoint that logs the move without a DB connection
let moveLog = [] // In-memory storage of moves

export const post = async ({ request }) => {
  const { email, move } = await request.json()

  // Store the move in memory (could be saved to a file or service instead)
  moveLog.push({ email, move })

  console.log('Move logged:', { email, move })

  return {
    body: JSON.stringify({ success: true, moveLog })
  }
}
