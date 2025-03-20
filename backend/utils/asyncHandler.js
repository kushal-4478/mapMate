const asyncHandler = (fn) => (req, res, next) => {
    Promise.resolve(fn(req, res, next)).catch(next);
  };

  //.catch(next)  passing it to the middle ware error
  
export default  asyncHandler;
