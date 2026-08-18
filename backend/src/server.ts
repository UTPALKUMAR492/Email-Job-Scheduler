import app from "./app";
import "./queue/email.worker";

const PORT = Number(process.env.PORT) || 4000;

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
  console.log("Email worker started");
});