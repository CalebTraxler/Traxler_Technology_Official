// pages/api/memory/[session_id].js

export default async function handler(req, res) {
  const { session_id } = req.query;

  if (req.method !== 'DELETE') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    console.log("Clearing memory for session:", session_id);

    // TODO: Replace with your actual LangChain memory clearing logic
    // Example:
    // const memory = getMemory(session_id);
    // await memory.clear();

    return res.status(200).json({
      session_id,
      stats: {},
    });
  } catch (err) {
    console.error("Error in DELETE /api/memory/[session_id]:", err);
    return res.status(500).send("Internal server error");
  }
}
