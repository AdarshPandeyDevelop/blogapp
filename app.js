require("dotenv").config();

const path = require("path");
const express = require("express");
const userRoute = require("./routes/user");
const mongoose = require("mongoose");
const cookieParser = require("cookie-parser");
const {
  checkForAuthenticationCookie,
} = require("./middlewares/authentication");

const blogRoute = require("./routes/blog");

const Blog = require("./models/blog");

const app = express();
const PORT = process.env.PORT || 3000;

mongoose
  .connect(process.env.MONGO_URL)
  .then((e) => console.log("MongoDB Connected"));

app.set("view engine", "ejs");
app.set("views", path.resolve("./views"));

app.use(express.urlencoded({ extended: false }));
app.use(express.static(path.resolve("./public")));
app.use(cookieParser());
app.use(checkForAuthenticationCookie("token"));

app.get("/", async (req, res) => {
  const allBlogs = await Blog.find({});
  res.render("home", {
    user: req.user,
    blogs: allBlogs,
  });
});

app.get("/test", (req, res) => {
  res.send("Server and routing working fine");
});

app.use("/users", userRoute);
app.use("/blog", blogRoute);

app.listen(PORT, () => console.log(`server started at PORT:${PORT}`));

//Remember something that for accessing this use localhost:3000/ and localhost:3000/users/signin
