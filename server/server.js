import express from "express"; 
const app = express();
const PORT = 5000;

app.use(express.json());

app.get("/", (req, res) => {
  res.send("Campus Connect Server/Backend Setup Working🚀");
});


app.listen(PORT, () => {
  console.log(`Server started on http://localhost:${PORT}`);
});
