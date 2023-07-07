const asyncHandler = fn => (req, res, next) => {
    Promise.resolve(fn(req, res, next)).catch(next);
}

// its gonna resolve a promise & call next piece of middleware

export default asyncHandler;
