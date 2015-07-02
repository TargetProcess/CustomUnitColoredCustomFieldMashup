'use strict';

var configurator = require('tau/configurator');
var _ = require('Underscore');

var reg = configurator.getBusRegistry();

var makeCb = function(cb) {

    return function() {

        cb.apply(null, _.rest(_.toArray(arguments)));

    };

};

var addBusListener = function(busName, eventName, listener, once) {

    reg.on('create', makeCb(function(data) {

        var bus = data.bus;

        if (bus.name === busName) {

            bus[once ? 'once' : 'on'](eventName, listener);

        }

    }));

    reg.on('destroy', makeCb(function(data) {

        var bus = data.bus;
        if (bus.name === busName) {

            bus.removeListener(eventName, listener);

        }

    }));

};

var addBusListenerOnce = function(busName, eventName, listener) {

    addBusListener(busName, eventName, listener, true);

};

module.exports = {
    addBusListener: addBusListener,
    addBusListenerOnce: addBusListenerOnce
};
