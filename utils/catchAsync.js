// directly creating and exporting a function
// here, we return a function that accepts a function and then catches any errors
// func is the function that we pass in 
module.exports = (func) => {
    return (req, res, next) => {
        // executes func and catches any possible errors
        func(req, res, next).catch(next);
    }
}