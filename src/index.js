/*globals mashup*/
'use strict';

import customUnits from 'targetprocess-mashup-helper/lib/customUnits';
import _ from 'underscore';
import $ from 'jquery';

import {openUnitEditor} from 'tau/models/board.customize.units/board.customize.units.interaction';
import template from './template.html';

const config = mashup.config;

const cfEditors = {
    'text': `customField.text.editor`,
    'number': `customField.number.editor`,
    'money': `customField.money.editor`,
    'date': `customField.date.editor`,
    'dropdown': `customField.dropdown.editor`
};

function getEditor(customField) {
    const typeName = customField.type.toLowerCase();
    return cfEditors[typeName] || null;
}

function getValue(field) {
    if (!field) {
        return '';
    }

    if (!_.isObject(field.value)) {
        return field.value;
    }

    if (field.value.uri) {
        return field.value.uri;
    }

    if (field.value.id) {
        return field.value.id;
    }

    return field.value;
}

/**
 * @param {String} color
 * @param {RegExp} pattern
 * @returns {{r: Number, g: Number, b: Number}|null} hex color components or null
 */
function tryParseRGB(color, pattern) {
    const match = color.match(pattern);
    if (match && match.length) {
        return {r: parseInt(match[1], 16), g: parseInt(match[2], 16), b: parseInt(match[3], 16)};
    }
    return null;
}

/**
 * @param {String} color
 * @returns {{r: Number, g: Number, b: Number}|null} hex color components or null
 */
function normalizeColor(color) {
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
}

function opacify(color, opacity) {
    const normalizedColor = normalizeColor(color);
    if (!normalizedColor) {
        return 'transparent';
    }

    const base = 255 * (1 - opacity);
    const r = base + normalizedColor.r * opacity;
    const g = base + normalizedColor.g * opacity;
    const b = base + normalizedColor.b * opacity;

    return `rgb(${Math.ceil(r)}, ${Math.ceil(g)}, ${Math.ceil(b)})`;
}

function getTextColor(config) {
    return typeof config === 'string' ? config : (config && config.text);
}

function getColor(cfConfig, field) {
    const config = field && cfConfig.colors[getValue(field)];
    return getTextColor(config) || 'inherit';
}

function getBackgroundColor(cfConfig, field) {
    const config = field && cfConfig.colors[getValue(field)];
    if (config && config.background) {
        return config.background;
    }

    const textColor = getTextColor(config);
    return textColor ? opacify(textColor, 0.3) : 'transparent';
}

config.forEach((cf) => {
    const name = cf.name;
    const id = `colored_custom_field_${_.underscored(name)}`;

    //noinspection JSUnusedGlobalSymbols
    const unit = {
        name: name,
        id: id,
        hideIf: (data) => !getValue(data[id]),

        template: {
            markup: template,
            customFunctions: {
                id: id,
                getColor: (field) => getColor(cf, field) || 'inherit',
                getBackgroundColor: (field) => getBackgroundColor(cf, field),
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

        csv: {
            columns: [
                {
                    id: id,
                    name: name,
                    model: 'cf:CustomValues.Get("' + name  + '").Value'
                }
            ]
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
    };

    if (cf.sortable !== false) {
        unit.category = 'simple';
        unit.sortConfig = {field: cf.name};
    }

    customUnits.add(unit);
});
