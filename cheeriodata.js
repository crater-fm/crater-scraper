function initialize(selector, context, r, opts) {
    if (r === void 0) { r = root; }
    return new LoadedCheerio(selector, context, r, tslib_1.__assign(tslib_1.__assign({}, internalOpts), options_1.flatten(opts)));
}