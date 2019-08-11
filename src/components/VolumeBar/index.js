import React, { Component } from 'react';
import PropTypes from 'prop-types';
import styled, { css } from 'styled-components';
import { connect } from 'react-redux';

import VolumeUpIcon from '@material-ui/icons/VolumeUp';
import VolumeDownIcon from '@material-ui/icons/VolumeDown';
import VolumeOffIcon from '@material-ui/icons/VolumeOff';

import ProgressBar from '../UI/ProgressBar';
import PlayerButton from '../UI/PlayerButton';
import { setVolume, muteToggle } from '../Player/actions';
import { getMousePosition } from '../../utils';

const Volume = styled.div`
  padding: 0;
  position: relative;
`;

const VolumeSlider = styled.div`
  position: absolute;
  bottom: calc(100% + 15px);
  height: 125px;
  width: 30px;
  border-radius: ${({ theme }) => theme.borderRadius};
  background-color: ${({ theme }) => theme.colors.content};
  box-shadow: ${({ theme }) => theme.shadows.primary};
  padding: 13px 0;
  opacity: 0;
  visibility: hidden;
  transform: scale(0);
  transform-origin: center bottom;
  transition: 0.2s opacity, 0.2s visibility, 0.12s transform;
  transition-delay: 0.28s;

  ${({ disabled }) =>
    !disabled &&
    css`
      ${Volume}:hover & {
        opacity: 1;
        visibility: visible;
        transform: scale(1);
      }
    `}
`;

class VolumeBar extends Component {
  constructor(props) {
    super(props);

    this.state = {
      mouseButtonPressed: false,
    };
  }

  setVolume = value => {
    const { setVolume } = this.props;

    value = value < 0 ? 0 : value > 1 ? 1 : value;
    setVolume(value);
  };

  setVolumeFromPosition(ev, ref) {
    const { topPosition } = getMousePosition(ev, ref);

    this.setVolume(1 - parseFloat(topPosition.toFixed(2)));
  }

  handleOnWheel(ev) {
    const { volume } = this.props;
    const { mouseButtonPressed } = this.state;

    if (!mouseButtonPressed) {
      const oneScrollDelta = 53; // значение дельты по Y при одной прокрутке колесика
      const volumeCoeff = Math.abs(ev.deltaY / oneScrollDelta);

      let volumeDelta = volumeCoeff * 0.025;
      volumeDelta = parseFloat(volumeDelta.toFixed(2));

      if (ev.deltaY < 0) {
        if (volume < 1)
          this.setVolume(parseFloat((volume + volumeDelta).toFixed(2)));
      } else if (volume > 0)
        this.setVolume(parseFloat((volume - volumeDelta).toFixed(2)));
    }
  }

  handleOnClick(ev, ref) {
    this.setVolumeFromPosition(ev, ref);
  }

  handleOnMouseMove(ev, ref) {
    const { mouseButtonPressed } = this.state;

    if (mouseButtonPressed) this.setVolumeFromPosition(ev, ref);
  }

  handleOnMouseDown() {
    this.setState({
      mouseButtonPressed: true,
    });
  }

  handleOnMouseUp() {
    this.setState({
      mouseButtonPressed: false,
    });
  }

  handleOnMouseLeave() {
    this.setState({
      mouseButtonPressed: false,
    });
  }

  render() {
    const { volume, muted, muteToggle, playlist } = this.props;
    const volumeBarRef = React.createRef();

    return (
      <Volume onWheel={ev => this.handleOnWheel(ev)}>
        <PlayerButton
          onClick={() => muteToggle()}
          hoverDisabled
          disabled={!playlist}
        >
          {!muted && volume > 0.4 ? (
            <VolumeUpIcon />
          ) : !muted && volume !== 0 ? (
            <VolumeDownIcon />
          ) : (
            <VolumeOffIcon />
          )}
        </PlayerButton>
        <VolumeSlider
          disabled={!playlist}
          ref={volumeBarRef}
          onClick={ev => this.handleOnClick(ev, volumeBarRef)}
          onMouseMove={ev => this.handleOnMouseMove(ev, volumeBarRef)}
          onMouseDown={() => this.handleOnMouseDown()}
          onMouseUp={() => this.handleOnMouseUp()}
          onMouseLeave={() => this.handleOnMouseLeave()}
        >
          <ProgressBar direction="vertical" filled={muted ? 0 : volume * 100} />
        </VolumeSlider>
      </Volume>
    );
  }
}

VolumeBar.propTypes = {
  volume: PropTypes.number,
  setVolume: PropTypes.func,
  muted: PropTypes.bool,
  muteToggle: PropTypes.func,
};

export default connect(
  ({ player }) => player,
  { setVolume, muteToggle }
)(VolumeBar);
