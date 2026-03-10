const express = require("express");
const cors = require("cors");
const path = require("path");
const fs = require("fs");
const routerContrller = require("./Router/routerAuth")
const app = express();

app.use(cors());
app.use(express.json());

app.use("/auth/aegis/auth", routerContrller);
// app.use("/uploads", express.static(path.join(__dirname, "uploads")));

const PORT = process.env.PORT || 5555;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});