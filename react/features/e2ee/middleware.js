// @flow

import { getCurrentConference } from '../base/conference';
import { getLocalParticipant, participantUpdated } from '../base/participants';
import { MiddlewareRegistry, StateListenerRegistry } from '../base/redux';

import { TOGGLE_E2EE, TOGGLE_E2EE_MAX_MODE } from './actionTypes';
import { toggleE2EE, toggleE2EEMaxMode } from './actions';
import logger from './logger';
import { playSound } from '../base/sounds';
import { E2EE_OFF_SOUND_ID, E2EE_ON_SOUND_ID } from '../recording/constants';
import { JitsiConferenceEvents } from '../base/lib-jitsi-meet';
import { toggleLobbyMode } from '../lobby/actions.web';

/**
 * Middleware that captures actions related to E2EE.
 *
 * @param {Store} store - The redux store.
 * @returns {Function}
 */
MiddlewareRegistry.register(({ dispatch, getState }) => next => action => {
    switch (action.type) {
    case TOGGLE_E2EE: {
        const conference = getCurrentConference(getState);

        if (conference && conference.isE2EEEnabled() !== action.enabled) {
            logger.debug(`E2EE will be ${action.enabled ? 'enabled' : 'disabled'}`);
            conference.toggleE2EE(action.enabled);

            // Broadcast that we enabled / disabled E2EE.
            const participant = getLocalParticipant(getState);

            dispatch(participantUpdated({
                e2eeEnabled: action.enabled,
                id: participant.id,
                local: true
            }));

            const soundID = action.enabled ? E2EE_ON_SOUND_ID : E2EE_OFF_SOUND_ID;
            dispatch(playSound(soundID));
        }

        break;
    }

    case TOGGLE_E2EE_MAX_MODE: {
        if (enabled) {
            dispatch(toggleLobbyMode(true, false, true));
        } else {
            const { userLobbyEnabled } = getState()['features/lobby'];
            if (!userLobbyEnabled) {
                dispatch(toggleLobbyMode(false));
            }
        }
       
        break;
    }
    }

    return next(action);
});

/**
 * Set up state change listener to perform maintenance tasks when the conference
 * is left or failed.
 */
StateListenerRegistry.register(
    state => getCurrentConference(state),
    (conference, { dispatch }, previousConference) => {
        if (conference) { 
            conference.on(JitsiConferenceEvents.E2EE_MAX_MODE_CHANGED, enabled => {
                dispatch(toggleE2EEMaxMode(enabled));
            });
        }
        if (previousConference) {
            dispatch(toggleE2EE(false));
        }
});
