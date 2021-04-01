// @flow

import { TOGGLE_E2EE, TOGGLE_MAX_MODE } from './actionTypes';

/**
 * Dispatches an action to enable / disable E2EE.
 *
 * @param {boolean} enabled - Whether E2EE is to be enabled or not.
 * @returns {Object}
 */
export function toggleE2EE(enabled: boolean) {
    return {
        type: TOGGLE_E2EE,
        enabled
    };
}

/**
 * Dispatches an action to enable / disable E2EE maxMode.
 *
 * @param {boolean} enabled - Whether maxMode is to be enabled or not.
 * @returns {Object}
 */
export function toggleE2EEMaxMode(enabled: boolean) {
    return {
        type: TOGGLE_MAX_MODE,
        enabled
    };
}
