'use strict';

var _ = require('Underscore');
var types = require('tau/models/board.customize.units/const.entity.types.names');
var sizes = require('tau/models/board.customize.units/const.card.sizes');

var configuratorHelper = require('./configurator');

var add = function(config) {

    config = _.defaults({}, config, {
        types: [
            types.ANY_TYPE
        ],
        sizes: [sizes.XS, sizes.S, sizes.M, sizes.L, sizes.XL, sizes.LIST]
    });

    return configuratorHelper
        .getAppConfigurator()
        .then(function(configurator) {

            var registry = configurator.getUnitsRegistry();
            _.extend(registry.units, registry.register([config]));

        });

};

module.exports = {
    types: types,
    sizes: sizes,
    add: add
};
