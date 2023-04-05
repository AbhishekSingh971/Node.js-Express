const asyncHandler = require("express-async-handler");
const User = require("../models/userModel");
const bcrypt = require("bcrypt"); // To store the password in the hash form
const jwt = require("jsonwebtoken"); // to decode the password //jwt contains three part
//1 is HEADER :- which contains all algorithms type
//2 is PAYLOAD :- which contains all the information of user pass through body
//3 is SIGNATURE: - to verify

//@desc register the user
//@route POST  /api/users/register
//@access public
const registerUser = asyncHandler(async (req, res) => {
  const { username, email, password } = req.body;
  if (!username || !email || !password) {
    res.status(400);
    throw new Error("All fields are mandatory");
  }
  const userAvailable = await User.findOne({ email });
  if (userAvailable) {
    res.status(400);
    throw new Error("User already registered");
  }

  //Hash Password
  const hashedPassword = await bcrypt.hash(password, 10);
  // In the above, The 'password' is a raw data and The '10' is a salt to make it more secure for the user
  const user = await User.create({ username, email, password: hashedPassword });

  console.log(`User created ${user}`);
  if (user) {
    res.status(201).json({ _id: user.id, email: user.email });
  } else {
    res.status(400);
    throw new Error("User data us not valid");
  }
});


//@desc login user
//@route POST  /api/users/login
//@access public
const loginUser = asyncHandler(async (req, res) => {
  const { email, password } = req.body;
  if (!email || !password) {
    res.status(400);
    throw new Error("All fields are mandatory!");
  }
  const user = await User.findOne({ email });

  //compare password with the hash password;
  if (user && (await bcrypt.compare(password, user.password))) {
    const accessToken = jwt.sign(
      {
        //this is for the payload in the jwt;
        user: {
          username: user.username,
          email: user.email,
          id: user.id,
        },
      },
      process.env.ACCESS_TOKEN_SECRET, //this is a SIGNATURE
      { expiresIn: "30m" } //this is a token expire time
    );
    res.status(200).json({ accessToken });
  }else{
    res.status(401);
    throw new Error("email or password is not valid");
  }
});

//@desc current user
//@route Get  /api/users/current
//@access private
const currentUser = asyncHandler(async (req, res) => {
  res.json(req.user);
});

module.exports = { registerUser, loginUser, currentUser };
