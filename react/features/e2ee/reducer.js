// @flow

import { ReducerRegistry } from '../base/redux';

import { TOGGLE_E2EE, TOGGLE_MAX_MODE } from './actionTypes';

const DEFAULT_STATE = {
    enabled: false,
    maxMode: false
};

/**
 * Reduces the Redux actions of the feature features/e2ee.
 */
ReducerRegistry.register('features/e2ee', (state = DEFAULT_STATE, action) => {
    switch (action.type) {
    case TOGGLE_E2EE:
        return {
            ...state,
            enabled: action.enabled
        };

    case TOGGLE_MAX_MODE: {
        return {
            ...state,
            maxMode: action.enabled
        };
    }

    default:
        return state;
    }
});
