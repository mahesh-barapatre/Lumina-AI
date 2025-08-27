const express = require("express");
const app = express();

app.get("/health", (req, res) => {
  res.json({ status: "ok", bot: "Lumina" });
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`✅ Health server running on http://localhost:${PORT}/health`);
});
