module.exports = function(api) {
    api.cache(true);
    return {
        // Allow sub-packages to override .babelrc.
        babelrcRoots: ['.', './blocks_backend_wrapper'],
    };
};
