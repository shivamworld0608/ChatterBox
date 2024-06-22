import mongoose from "mongoose";

const connectToMongoDB = async () => {
	try {
		await mongoose.connect(process.env.MONGOURI, {
                useNewUrlParser: true, 
                useUnifiedTopology: true,
    });
		console.log("MongoDB URI:", process.env.MONGOURI);
		console.log("Connected to MongoDB"); 
	} catch (error) {
		console.log("Error connecting to MongoDB", error.message);
	}
}; 
 
export default connectToMongoDB;
