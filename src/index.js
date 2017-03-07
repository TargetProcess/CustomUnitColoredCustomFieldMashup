/*globals mashup*/
'use strict';

import customUnits from 'targetprocess-mashup-helper/lib/customUnits';
import _ from 'underscore';
import $ from 'jquery';

import {openUnitEditor} from 'tau/models/board.customize.units/board.customize.units.interaction';
import template from './template.html';

const config = mashup.config;

const getEditor = (customField) => {
    const typeName = customField.type.toLowerCase();
    const typeNames = ['text', 'number', 'money', 'date', 'dropdown'];
    return (typeNames.indexOf(typeName) >= 0) ? `customField.${typeName}.editor` : null;
};

const getColor = (cfConfig, field) => field ? (cfConfig.colors[field.value] || null) : null;

const getValue = (field) => field ? field.value : '';

/**
 * @param {String} color
 * @param {RegExp} pattern
 * @returns {{r: Number, g: Number, b: Number}|null} hex color components or null
 */
const tryParseRGB = (color, pattern) => {
    const match = color.match(pattern);
    if (match && match.length) {
        return {r: parseInt(match[1], 16), g: parseInt(match[2], 16), b: parseInt(match[3], 16)};
    }
    return null;
};

/**
 * @param {String} color
 * @returns {{r: Number, g: Number, b: Number}|null} hex color components or null
 */
const normalizeColor = (color) => {
    if (color[0] === '#') {
        color = color.slice(1);
    }

    const rgb = tryParseRGB(color, /^([\da-f]{2})([\da-f]{2})([\da-f]{2})$/i);
    if (rgb) {
        return rgb;
    }

    color = $('<span />').css('color', color).css('color');
    return tryParseRGB(color, /^rgb\((\d+),\s*(\d+),\s*(\d+)\)$/) ||
        tryParseRGB(color, /^rgba\((\d+),\s*(\d+),\s*(\d+),\s*([\d.]+)\)$/);
};

const opacify = (color, opacity) => {
    const normalizedColor = normalizeColor(color);
    if (!normalizedColor) {
        return 'transparent';
    }

    const base = 255 * (1 - opacity);
    const r = base + normalizedColor.r * opacity;
    const g = base + normalizedColor.g * opacity;
    const b = base + normalizedColor.b * opacity;

    return `rgb(${Math.ceil(r)}, ${Math.ceil(g)}, ${Math.ceil(b)})`;
};

config.forEach((cf) => {
    const name = cf.name;
    const id = `colored_custom_field_${_.underscored(name)}`;

    customUnits.add({
        name: name,
        id: id,
        hideIf: (data) => !getValue(data[id]),

        template: {
            markup: template,
            customFunctions: {
                id: id,
                getColor: (val) => getColor(cf, val) || 'inherit',
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
                const customField = scope.data[id];
                return customField && customField.type && !customField.calculationModel && getEditor(customField);
            },

            handler: function(data, environment) {
                const customField = data.cardDataForUnit[id];
                const editor = openUnitEditor(getEditor(customField), {});
                data.cardDataForUnit.cf = data.cardDataForUnit[id];
                return editor(data, environment);
            }
        }
    });
});
