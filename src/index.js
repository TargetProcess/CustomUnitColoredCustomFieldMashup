/*globals mashup*/
/*eslint no-bitwise:0*/
'use strict';

import targetprocessHelper from 'targetprocess-mashup-helper';
import _ from 'underscore';
import $ from 'jquery';

const config = mashup.config;
const cu = targetprocessHelper.customUnits;

import template from 'raw!./template.html';

const getColor = (cfConfig, customValues) => {

    const field = _.findWhere(customValues.customFields, {

        name: cfConfig.name

    });
    var color;

    if (field) {

        color = cfConfig.colors[field.value];

    }

    return color;

};

const getValue = (cfConfig, customValues) => {

    const field = _.findWhere(customValues.customFields, {

        name: cfConfig.name

    });
    var value;

    if (field) {

        value = field.value;

    }

    return value;

};

const hexDigits = ['0', '1', '2', '3', '4', '5', '6', '7', '8', '9', 'a', 'b', 'c', 'd', 'e', 'f'];

const hex = (x) => {

    return isNaN(x) ? '00' : hexDigits[(x - x % 16) / 16] + hexDigits[x % 16];

};

const rgb2hex = (rgb) => {

    rgb = rgb.match(/^rgb\((\d+),\s*(\d+),\s*(\d+)\)$/);
    return hex(rgb[1]) + hex(rgb[2]) + hex(rgb[3]);

};

const opacify = (col, a) => {

    if (col[0] === '#') {

        col = col.slice(1);

    }

    if (!col.match(/^[0-9a-f]+$/i)) {

        const rgb = $('<span />').css('color', col).css('color');

        col = rgb2hex(rgb);

    }

    const color = parseInt(col, 16);
    const r = color >> 16;
    const g = ((color >> 8) & 0x00FF);
    const b = (color & 0x0000FF);

    const tr = (1 - a) + r / 255 * a;
    const tg = (1 - a) + g / 255 * a;
    const tb = (1 - a) + b / 255 * a;

    return 'rgb(' + [Math.ceil(tr * 255), Math.ceil(tg * 255), Math.ceil(tb * 255)].join(', ') + ')';

};

config.forEach((cf) => {

    const name = cf.name;

    cu.add({
        name: name,
        id: `colored_custom_field_${_.underscored(name)}`,
        hideIf: (data) => {

            return !getValue(cf, data.customValues);

        },
        template: {
            markup: [template],
            customFunctions: {
                getColor: getColor.bind(null, cf),
                getBackgroundColor: (val) => {

                    const color = getColor(cf, val);

                    if (!color) {

                        return '';

                    }
                    return opacify(color, 0.3);

                },
                getValue: getValue.bind(null, cf)
            }
        },
        sampleData: {
            customValues: {
                customFields: [{
                    name: 'Favorite Fruit',
                    value: 'Apple'
                }]
            }
        },
        model: 'customValues:CustomValues'
    });

});
