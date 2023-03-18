require('dotenv').config();
// Allows access to environment variables. we set these in .env file at the root level
// require this package above express


// below will have async operations and apply try catch to all of our controllers automatically
require('express-async-errors');

// express
const express = require('express');
const app = express();

// rest of packages
const morgan = require('morgan');
const cookieParser = require('cookie-parser');
const fileUpload = require('express-fileupload');
const rateLimiter = require('express-rate-limit');
const helmet = require('helmet');
const xss = require('xss-clean');
const cors = require('cors');
const mongoSanitize = require('express-mongo-sanitize')




// database
const connectDB = require('./db/connect');

// routers
const authRouter = require('./routes/authRoutes');
const userRouter = require('./routes/userRoutes');
const productRouter = require('./routes/productRoutes');
const reviewRouter = require('./routes/reviewRoutes');
const orderRouter = require('./routes/orderRoutes');


// middleware ***** PLACE BEFORE ROUTES *****
// invoke middleware with app.use() below gives access to json data
// in req.body.  json() is middleware that is built into express
const notFoundMiddleware = require('./middleware/not-found');
const errorHandlerMiddleware = require('./middleware/error-handler');

// if behind proxy
app.set('trust proxy', 1);
app.use(rateLimiter({
    windowMs: 15 * 60 * 1000,
    max: 60,
})
);

app.use(helmet());
app.use(cors());
app.use(xss());
app.use(mongoSanitize());




// morgan outputs in console which route you are hitting
app.use(morgan('tiny'));
app.use(express.json());
app.use(cookieParser(process.env.JWT_SECRET));

app.use(express.static('./public'));
app.use(fileUpload());

// *** ROUTES ******************************
app.get('/', (req, res) => {
    console.log('hello world')
    console.log(req.signedCookies);
    res.send('<h1>Hello World</h1>');
});

// connects with userController and authController through userRouter and authRouter
app.use('/api/v1/auth', authRouter);
app.use('/api/v1/users', userRouter);
app.use('/api/v1/products', productRouter);
app.use('/api/v1/reviews', reviewRouter);
app.use('/api/v1/orders', orderRouter);




// place the 404 (notFoundMiddleware) before errorHandlerMiddleware express rules 
// require it as last middleware because we only hit it from an existing route.
app.use(notFoundMiddleware);
app.use(errorHandlerMiddleware);


// **** CONNECT TO ATLAS

const port = process.env.PORT || 5000;

const start = async () => {
    try {
        // connect DB
        await connectDB(process.env.MONGO_URL);
        app.listen(port, () =>
            console.log(`Server is listening on port ${port}...`));
    } catch (error) {
        console.log(error);
    }
}
start();