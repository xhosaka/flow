import React from 'react';
import PropTypes from 'prop-types';
import styled from '@emotion/styled/macro';

import PlayArrowIcon from '@material-ui/icons/PlayArrow';
import PauseIcon from '@material-ui/icons/Pause';

import PlayerButton from '../../common/UI/PlayerButton';
import TimeLabel from '../../common/UI/TimeLabel';
import TrackInfo from '../../common/UI/TrackInfo';

import { humanizeTrackTime } from '../../utils';

const Wrapper = styled.div`
  display: flex;
  align-items: center;
  position: relative;
`;

const PlayerButtonStyled = styled(PlayerButton)`
  display: flex;
  align-items: center;
  justify-content: center;
  position: absolute;
  left: 0;
  top: 0;
  height: 100%;
  width: 100%;
  margin: 0;
  z-index: 1;
  opacity: ${({ visible }) => (visible ? '1' : '0')};

  &:before {
    content: '';
    z-index: -1;
    position: absolute;
    left: 0;
    top: 0;
    height: 100%;
    width: 100%;
    background-color: ${({ theme }) => theme.palette.background.overlay};
    transition: opacity ${({ theme }) => theme.transitions.short}ms;
    opacity: ${({ visible }) => (visible ? '1' : '0')};
  }

  &:hover,
  &:focus {
    opacity: 1;

    &:before {
      opacity: 1;
    }
  }
`;

const TimeLabelStyled = styled(TimeLabel)`
  margin-left: auto;
`;

const PlaylistItem = ({
  className,
  track,
  currentTrackID,
  playToggle,
  setTrack,
  playingNow,
}) => {
  const handleButtonClick = () => {
    if (currentTrackID === track.id) {
      playToggle();
    } else {
      setTrack(track.id, true);
    }
  };

  return (
    <Wrapper className={className}>
      <TrackInfo {...track}>
        {track ? (
          <PlayerButtonStyled
            visible={currentTrackID === track.id}
            onClick={handleButtonClick}
            activated={currentTrackID === track.id}
          >
            {playingNow && currentTrackID === track.id ? (
              <PauseIcon />
            ) : (
              <PlayArrowIcon />
            )}
          </PlayerButtonStyled>
        ) : null}
      </TrackInfo>
      <TimeLabelStyled disabled={!track}>
        {humanizeTrackTime(track ? track.duration : null)}
      </TimeLabelStyled>
    </Wrapper>
  );
};

PlaylistItem.propTypes = {
  className: PropTypes.string,
  track: PropTypes.shape({
    id: PropTypes.string,
    artist: PropTypes.string,
    trackname: PropTypes.string,
    album: PropTypes.string,
    src: PropTypes.string,
    img: PropTypes.string,
    duration: PropTypes.number,
  }),
  currentTrackID: PropTypes.string,
  playToggle: PropTypes.func,
  setTrack: PropTypes.func,
  playingNow: PropTypes.bool,
};

export default PlaylistItem;