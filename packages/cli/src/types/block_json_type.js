// @flow

// The following type definitions are shared between blocks-cli and
// blocks-backend-wrapper. The cleanest setup would be to split these off into a
// third shared package that both depend on. However, we are currently putting
// these definitions in blocks-backend-wrapper because
// - We are still rapidly iterating on the building and packaging of blocks, and
//   may ultimately decide to split the blocks-backend-wrapper package for other
//   reasons. But without a strong reason to do the split right now, we don't want
//   to prematurely complicate things.
// - blocks-cli will currently depend on blocks-backend-wrapper for running
//   blocks locally. We don't want to introduce a dependency cycle, so we will
//   keep blocks-backend-wrapper as independent as possible and keep any shared
//   code in blocks-backend-wrapper.
export * from '../../blocks_backend_wrapper/types/block_json_type';
