import dns from "node:dns";
dns.setServers(["1.1.1.1", "8.8.8.8"]);



import mongoose from "mongoose"
// import { env } from "node:process";
import DB_NAME from "../../constant";




const dbConnection = async () => {

    console.log("db function start");

    if (mongoose.connection.readyState === 1) return;
    console.log("entring into try function start");
    try {
        console.log("ented into try function start");
        await mongoose.connect(`${process.env.MONGODB_URL}/${DB_NAME}`);
        // console.log("db ic connected", connected);
        console.log("db ic connected with db name", mongoose.connection.name);
        console.log("db ic connected with host name", mongoose.connection.host);


    } catch (error) {
        console.error(error);
        throw error

    }
}

export default dbConnection