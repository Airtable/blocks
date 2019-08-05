module.exports = function(api) {
    api.cache(true);
    return {
        // Allow sub-packages to override .babelrc.
        babelrcRoots: ['.', './block_backend_wrapper'],
    };
};
