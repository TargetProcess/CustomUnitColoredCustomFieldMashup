/*globals mashup*/
/*eslint no-bitwise:0*/
'use strict';

import cu from 'targetprocess-mashup-helper/lib/customUnits';
import _ from 'underscore';
import $ from 'jquery';

const config = mashup.config;

import {openUnitEditor} from 'tau/models/board.customize.units/board.customize.units.interaction';

const getEditor = (customField) => {

    const typeName = customField.type.toLowerCase();
    const typeNames = ['text', 'number', 'money', 'date', 'dropdown'];

    return (typeNames.indexOf(typeName) >= 0) ? `customField.${typeName}.editor` : null;

};

import template from './template.html';

const getColor = (cfConfig, field) => field ? (cfConfig.colors[field.value] || null) : null;

const getValue = (field) => field ? field.value : '';

const hexDigits = ['0', '1', '2', '3', '4', '5', '6', '7', '8', '9', 'a', 'b', 'c', 'd', 'e', 'f'];

const hex = (x) => isNaN(x) ? '00' : hexDigits[(x - x % 16) / 16] + hexDigits[x % 16];

const rgb2hex = (rgb) => {

    const comps = rgb.match(/^rgb\((\d+),\s*(\d+),\s*(\d+)\)$/);

    if (comps && comps.length) {

        return hex(comps[1]) + hex(comps[2]) + hex(comps[3]);

    }

    return null;

};

const opacify = (col, a) => {

    if (col[0] === '#') {

        col = col.slice(1);

    }

    if (!col.match(/^[0-9a-f]{6}$/i)) {

        const rgb = $('<span />').css('color', col).css('color');

        const normalizedColor = rgb2hex(rgb);

        if (normalizedColor) {

            const color = parseInt(normalizedColor, 16);
            const r = color >> 16;
            const g = ((color >> 8) & 0x00FF);
            const b = (color & 0x0000FF);

            const tr = (1 - a) + r / 255 * a;
            const tg = (1 - a) + g / 255 * a;
            const tb = (1 - a) + b / 255 * a;

            return 'rgb(' + [Math.ceil(tr * 255), Math.ceil(tg * 255), Math.ceil(tb * 255)].join(', ') + ')';

        } else {

            return 'transparent';

        }

    }

};

config.forEach((cf) => {

    const name = cf.name;
    const id = `colored_custom_field_${_.underscored(name)}`;

    cu.add({
        name: name,
        id: id,
        hideIf: (data) => !getValue(data[id]),
        template: {
            markup: template,
            customFunctions: {
                id: id,
                getColor: (val) => getColor(cf, val),
                getBackgroundColor: (val) => {

                    const color = getColor(cf, val);

                    return color ? opacify(color, 0.3) : 'transparent';

                },
                getValue: getValue
            }
        },
        sampleData: {
            [id]: {
                value: _.keys(cf.colors)[0] || 'Value'
            }
        },
        model: {
            [id]: `CustomValues.Get("${name}")`
        },
        interactionConfig: {
            isEditable: function(scope) {

                var customField = scope.data[id];

                return customField && customField.type && !customField.calculationModel && getEditor(customField);

            },
            handler: function(data, environment) {

                var customField = data.cardDataForUnit[id];
                var editor = openUnitEditor(getEditor(customField), {});

                data.cardDataForUnit.cf = data.cardDataForUnit[id];

                return editor(data, environment);

            }
        }
    });

});
