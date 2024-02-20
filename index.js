const bodyParser = require("body-parser");
const express = require("express");
const connectDB = require("./config/dbConnect");
const notFound= require("./middlewares/not-found");
const errorHandler = require('./middlewares/errorHandler');
const app = express();
require("dotenv").config();
const PORT = 3000;
const authRouter = require("./routes/authRoute");
const productRouter = require("./routes/productRoute");
const fashionRouter = require('./routes/fashionModel');
const sizeRouter = require('./routes/sizeRoute');
const targetAudienceRouter = require('./routes/targetAudience');
const StoreRouter = require('./routes/storeRoute');
const brandRouter = require("./routes/brandRoute");
const colorRouter = require("./routes/colorRoute");
const releasesRouter = require('./routes/releasesRoute');
const resellRouter = require('./routes/resellRoute');
const uploadRouter = require("./routes/uploadRoute");
const cookieParser = require("cookie-parser");
const morgan = require("morgan");
const cors = require("cors");


app.use(morgan("dev"));
app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());


app.use("/api/user", authRouter);
app.use("/api/sneakers", productRouter);
app.use('/api/releases', releasesRouter);
app.use('/api/resell', resellRouter);


app.use('/api/store', StoreRouter);
app.use('/api/fashion-model', fashionRouter);
app.use('/api/size', sizeRouter);
app.use("/api/brand", brandRouter);
app.use('/api/target-audience', targetAudienceRouter);
app.use("/api/color", colorRouter);
app.use('/api/upload', uploadRouter);

app.use(notFound);
app.use(errorHandler);


const Start = async ()=>{
  try{
      await connectDB(process.env.MONGODB_URL);
      console.log('Connected Successfuly to the DB');
      app.listen(PORT,console.log(`Server started on ${PORT}`));
  } catch (error) {
      console.log(error);
  }
}
Start()