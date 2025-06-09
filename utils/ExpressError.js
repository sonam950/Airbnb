class ExpressError extends Error {
 constructor(message, statusCode) {
   super(message); // Call the parent constructor with the message
   this.statusCode = statusCode; // Set the status code
  this.message = message; // Set the error message
  }     

}
module.exports = ExpressError; // Export the class for use in other files