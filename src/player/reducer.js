import {
  PLAY_TOGGLE,
  SET_CURRENT_TRACK,
  REPEAT_TOGGLE,
  SHUFFLE_PLAYLIST_TOGGLE,
  FETCH_TRACK_EXECUTED,
  FETCH_PLAYLIST_BEGIN,
  FETCH_PLAYLIST_SUCCESS,
  FETCH_PLAYLIST_FAILURE,
} from './constants';

import { searchArrItemByID, getRandomInt } from '../utils';

const initialState = {
  playlistIsLoading: false,
  fetchPlaylistError: null,
  playlist: null,

  trackIsLoading: false,
  fetchTrackError: null,

  playingNow: false,
  track: null,

  repeating: false,
  shuffledPlaylist: null,
};

const getClosestTracks = (currentTrackID, playlist) => {
  const currentTrack = searchArrItemByID(playlist, currentTrackID);
  const currentTrackIndex = playlist.indexOf(currentTrack);

  let prevTrack = playlist[currentTrackIndex - 1];
  prevTrack = prevTrack ? prevTrack : null;

  let nextTrack = playlist[currentTrackIndex + 1];
  nextTrack = nextTrack ? nextTrack : null;

  return {
    currentTrack,
    prevTrack,
    nextTrack,
  };
};

export function playerReducer(state = initialState, action) {
  switch (action.type) {
    case REPEAT_TOGGLE:
      return { ...state, repeating: !state.repeating };

    case PLAY_TOGGLE:
      return { ...state, playingNow: !state.playingNow };

    case SET_CURRENT_TRACK: {
      const { playlist, shuffledPlaylist } = state;
      const { id, playingNow } = action.payload;

      const currentPlaylist = shuffledPlaylist || playlist;

      const closestTracks = getClosestTracks(id, currentPlaylist);

      return {
        ...state,
        track: {
          ...closestTracks.currentTrack,
          prevTrack: closestTracks.prevTrack,
          nextTrack: closestTracks.nextTrack,
        },
        playingNow: playingNow || state.playingNow, ///что это за ????
        trackIsLoading: true,
        fetchTrackError: null,
      };
    }

    case SHUFFLE_PLAYLIST_TOGGLE: {
      const { shuffledPlaylist, playlist, track } = state;

      if (shuffledPlaylist) {
        const closestTracks = getClosestTracks(track.id, playlist);

        return {
          ...state,
          shuffledPlaylist: null,
          track: {
            ...track,
            prevTrack: closestTracks.prevTrack,
            nextTrack: closestTracks.nextTrack,
          },
        };
      }

      const currentPlaylist = playlist;
      const playlistLength = currentPlaylist.length;

      const prevIndexesSequence = [...Array(playlistLength).keys()];
      const nextPlaylist = [];

      while (prevIndexesSequence.length > 0) {
        const getRandomIndex = getRandomInt(1, prevIndexesSequence.length) - 1;

        nextPlaylist.push(currentPlaylist[prevIndexesSequence[getRandomIndex]]);
        prevIndexesSequence.splice(getRandomIndex, 1);
      }

      const closestTracks = getClosestTracks(track.id, nextPlaylist);

      return {
        ...state,
        shuffledPlaylist: nextPlaylist,
        track: {
          ...track,
          prevTrack: closestTracks.prevTrack,
          nextTrack: closestTracks.nextTrack,
        },
      };
    }

    case FETCH_TRACK_EXECUTED:
      return {
        ...state,
        trackIsLoading: false,
        fetchTrackError: action.payload.error ? action.payload.error : null,
      };

    case FETCH_PLAYLIST_BEGIN:
      return {
        ...state,
        playlistIsLoading: true,
        fetchPlaylistError: null,
      };

    case FETCH_PLAYLIST_SUCCESS: {
      const { playlist } = action.payload;

      return {
        ...state,
        playlist: action.payload.playlist,
        track: { ...playlist[0], prevTrack: null, nextTrack: playlist[1] },
        playlistIsLoading: false,
      };
    }

    case FETCH_PLAYLIST_FAILURE:
      return {
        ...state,
        fetchPlaylistError: action.payload.error,
        playlistIsLoading: false,
      };

    default:
      return state;
  }
}
