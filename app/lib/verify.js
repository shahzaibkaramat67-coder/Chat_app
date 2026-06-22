import { decode } from "punycode";
import  jwt  from "jsonwebtoken";

const getToken = async (req)=>{
   
    const token = req.cookies.get("AccessToken").value;

        const decode =await jwt.verify(token,process.env.ACCESS_TOKEN_SECRET)

        const userId = decode._id

        return userId


}

export default getToken