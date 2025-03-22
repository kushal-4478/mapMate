import error from "error";

const errorHandler = (err, req, res, next) => {
    console.error(err.stack);

    //Mongodb Id error 
    if(err.name === "CastError"){
        throw new Error(`Resource not found ${err.path}`)
    }
  
    res.status(err.statusCode || 500).json({
      success: false,
      message: err.message || 'Internal Server Error',
    });
  };
  
 export default  errorHandler;
  