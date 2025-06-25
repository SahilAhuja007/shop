const express = require("express");
const router = require("./routes/rout");
require("dotenv").config();
const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json());
app.use(require("cors")());
require("./config/mongodb").connectmongodb();

require("./config/cloudinary").connectCloudianry();

app.use("/riwaz", router);

app.listen(PORT, () => {
  console.log(`server started at ${PORT}`);
});
