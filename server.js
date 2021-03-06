const mongoose = require('mongoose');
const dotenv = require('dotenv');

//Handling Uncaught Exceptions
process.on('uncaughtException', (err) => {
  console.log('UNCAUGHT EXCEPTION !!: Shutting Down...');
  console.log(err.name, err.message);
  process.exit(1);
});

dotenv.config({ path: './config.env' });
//console.log(app.get('env'));
//console.log(process.env);
const app = require('./app');

const DB = process.env.DATABASE.replace(
  '<PASSWORD>',
  process.env.DATABASE_PASSWORD
);

mongoose
  //.connect(process.env.DATABASE_LOCAL, {
  .connect(DB, {
    useNewUrlParser: true,
    useCreateIndex: true,
    useFindAndModify: false,
    useUnifiedTopology: true
  })
  //.then((con) => {
  .then(() => {
    //console.log(con.connections);
    console.log('DB Connection Successful');
  });

//4) Start Server
const port = process.env.PORT || 3000;
const server = app.listen(port, () => {
  console.log(`App running on port ${port}...`);
});

//Handling Unhandled Rejections
process.on('unhandledRejection', (err) => {
  console.log('UNHANDLED REJECTION !!: Shutting Down...');
  console.log(err.name, err.message);
  server.close(() => {
    process.exit(1);
  });
});

//console.log(x); //To create a uncaught exception

//Responding to a SIGTERM signal
process.on('SIGTERM', () => {
  console.log('SIGTERM Received, Shutting down gracefully!');
  server.close(() => {
    console.log('Process Terminated');
  });
});
