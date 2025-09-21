import express from "express";

const app = express();
app.get("/hello", (req, res) => {
  res.json("Hello World" );
});
app.listen(3000, () => console.log("Server running on http://localhost:3000"));