import mongoose from "mongoose";

const connectToMongoDB = async () => {
	try {
		console.log("MongoDB URI:", process.env.MONGODB_URI);
		await mongoose.connect(process.env.MONGODB_URI, {
                useNewUrlParser: true,
                useUnifiedTopology: true,
    });
		console.log("Connected to MongoDB"); 
	} catch (error) {
		console.log("Error connecting to MongoDB", error.message);
	}
}; 
 
export default connectToMongoDB;
