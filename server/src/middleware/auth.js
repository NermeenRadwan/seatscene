const jwt=require ("jsonwebtoken");
const User =require("../models/users.js");
const dotenv=require ("dotenv");
dotenv.config();

const auth = async (req, res, next) => {
  try {
    const token = req.header("Authorization").replace("Bearer ", "");
    const decoded = jwt.verify(token, process.env.SECRET);
    console.log(decoded);
    const user = await User.findById(decoded._id);
    if (!user) throw new Error();
    req.user = user;
    req.token = token;
    next();
  } catch (error) {
    res.status(401).send({
      message: "Not Authorized",
    });
  }
};

module.exports= auth;