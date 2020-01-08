import { createSelector } from 'reselect';
import { createReducer } from '../utils';

//action types
export const PLAY_TOGGLE = 'PLAY_TOGGLE';
export const SET_CURRENT_TRACK_ID = 'SET_CURRENT_TRACK_ID';

export const SET_CURRENT_PLAYLIST_ID = 'SET_CURRENT_PLAYLIST_ID';

export const FETCH_PLAYLIST_BEGIN = 'FETCH_PLAYLIST_BEGIN';
export const FETCH_PLAYLIST_SUCCESS = 'FETCH_PLAYLIST_SUCCESS';
export const FETCH_PLAYLIST_FAILURE = 'FETCH_PLAYLIST_FAILURE';

//action creators
export const playToggle = () => ({
  type: PLAY_TOGGLE,
});

export const setCurrentTrackID = ({ ID, playingNow }) => ({
  type: SET_CURRENT_TRACK_ID,
  payload: {
    ID,
    playingNow,
  },
});

export const setCurrentPlaylistID = ID => ({
  type: SET_CURRENT_PLAYLIST_ID,
  payload: {
    ID,
  },
});

//reducer
const initialState = {
  currentPlaylistID: null,
  playingNow: false,
  currentTrackID: null,
};

export const playerReducerMap = {
  [PLAY_TOGGLE]: state => ({
    ...state,
    playingNow: !state.playingNow,
  }),
  [SET_CURRENT_TRACK_ID]: (state, action) => ({
    ...state,
    currentTrackID: action.payload.ID,
    playingNow: action.payload.playingNow || state.playingNow, //TODO: это для того, чтоб сразу проиграть, перепискать нужно как-то
  }),
  [SET_CURRENT_PLAYLIST_ID]: (state, action) => ({
    ...state,
    currentPlaylistID: action.payload.ID,
  }),
};

export const playerReducer = createReducer(initialState, playerReducerMap);

//selectors
export const playerSelector = state => state.player;
export const getPlayingNow = state => state.player.playingNow;
