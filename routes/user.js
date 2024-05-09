const { Router } = require("express");
const User = require("../models/user");
const Blogs = require("../models/blog")
const router = Router();

router.get("/signin", (req, res) => {
  return res.render("signin");
});

router.get("/signup", (req, res) => {
  return res.render("signup");
});

router.get("/home", async (req, res) => {
  const blogs = await Blogs.find({})
  return res.render("index", { blogs: blogs })
})

router.post("/signin", async (req, res) => {
  const { email, password } = req.body;
  try {
    const token = await User.matchPasswordAndGenerateToken(email, password);
    const user  = await User.findOne({ email })
    const blogs = await Blogs.find({})
    console.log(user.fullName);
    console.log(blogs);
    return res.cookie("token", token).render("index", { username: user.fullName, blogs: blogs });
  } catch (error) {
    return res.render("signin", {
      error: "Incorrect Email or Password",
    });
  }
});
router.get("/add-new", (req, res) => {
    return res.render("addBlog",{
      user: req.user,
    });
  });
router.get("/logout", (req, res) => {
  res.clearCookie("token").redirect("/");
});

router.post("/signup", async (req, res) => {
  const { fullName, email, password } = req.body;
  const count = await User.countDocuments()
  await User.create({
    fullName,
    email,
    password,
    userCount: count + 1
  });
  return res.redirect("/");
});

module.exports = router;