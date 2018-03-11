const express = require("express");
const routes = require("./routes");

const app = express();
const PORT = process.env.PORT || 3000;

app.use("/", routes);

app.listen(PORT, () => {
  console.log(`this server is listening on ${PORT}`);
});
