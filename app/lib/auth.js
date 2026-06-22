import jwt from "jsonwebtoken";

const generateAccesstokenAndRefreshToken = async (user_id) => {
  const accessToken = jwt.sign(
    {
      userId: user_id,
    },
    process.env.ACCESS_TOKEN_SECRET,
    {
      expiresIn: process.env.ACCESS_TOKEN_EXPIRE,
    }
  );

  const refreshToken = jwt.sign(
    {
      userId: user_id,
    },
    process.env.REFRESH_TOKEN_SECRECT,
    {
      expiresIn: process.env.REFRESH_TOKEN_EXPIRE,
    }
  );

  return { accessToken, refreshToken };
};

export default generateAccesstokenAndRefreshToken;