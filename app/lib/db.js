import mongoose from "mongoose"
// import { env } from "node:process";
import DB_NAME from "../../constant";
const dbConnection = async()=>{
    if (mongoose.connection.readyState === 1) return;
    try {
        const connected = await mongoose.connect(`${process.env.MONGODB_URL}${DB_NAME}`);
        console.log("db ic connected");
        console.log("db ic connected with db name", mongoose.connection.name);
        console.log("db ic connected with host name", mongoose.connection.host);
        
        
    } catch (error) {
        console.error(error);
        
    }
}

export default dbConnection