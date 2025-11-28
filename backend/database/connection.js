import mongoose from "mongoose";

export const connection = () => {
  const mongoUri = process.env.MONGODB_URI || 'mongodb://localhost:27017/auction_platform';
  console.log(`Connecting to MongoDB at: ${mongoUri}`);
  
  mongoose
    .connect(mongoUri, {
      dbName: "MERN_AUCTION_PLATFORM",
    })
    .then(() => {
      console.log("Connected to database.");
    })
    .catch((err) => {
      console.log(`Some error occured while connecting to database: ${err}`);
    });
};
