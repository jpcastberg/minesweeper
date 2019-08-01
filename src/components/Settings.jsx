import React, { Component } from 'react';
import propTypes from 'prop-types';

import {
  SettingsContainer,
  Setting,
  SettingInput,
  SettingsButton,
} from '../styles/settingsStyles';

class Settings extends Component {
  constructor(props) {
    super(props);
    this.state = {
      heightValue: String(props.boardHeight),
      widthValue: String(props.boardWidth),
      numberOfMinesValue: String(props.numberOfMines),
    };
    this.updateValue = this.updateValue.bind(this);
    this.handleReset = this.handleReset.bind(this);
  }

  updateValue(context, newValue) {
    const { state: { heightValue, widthValue } } = this;
    const heightAndWidthRegex = /^(^$|[1-9]|[1-2][0-9]|30)$/;
    const numberOfMinesRegex = /^(^$|[1-9]|[1-9][0-9]|[1-8][0-9][0-9])$/;
    if (context === 'numberOfMinesValue' && numberOfMinesRegex.test(newValue)) {
      const newNumberOfMines = Number(newValue);
      const newHeightValue = Number(heightValue);
      const newWidthValue = Number(widthValue);
      if (newNumberOfMines >= newHeightValue * newWidthValue) return;
    } else if (!heightAndWidthRegex.test(newValue)) return;
    this.setState({
      [context]: newValue,
    });
  }

  generateButton() {
    const { state: { heightValue, widthValue, numberOfMinesValue }, handleReset } = this;
    if (Number(numberOfMinesValue) < Number(heightValue) * Number(widthValue)) {
      return (
        <SettingsButton onClick={handleReset}>Apply and Restart</SettingsButton>
      );
    }
    return (
      <SettingsButton disabled>Please enter valid settings</SettingsButton>
    );
  }

  handleReset() {
    const {
      state: { heightValue, widthValue, numberOfMinesValue },
      props: { resetGame },
    } = this;
    resetGame(Number(heightValue), Number(widthValue), Number(numberOfMinesValue));
  }

  render() {
    const { state: { heightValue, widthValue, numberOfMinesValue } } = this;
    return (
      <SettingsContainer>
        <Setting>
          Board Height:&nbsp;
          <SettingInput type="text" value={heightValue} onChange={e => this.updateValue('heightValue', e.target.value)} />
        </Setting>
        <Setting>
          Board Width:&nbsp;
          <SettingInput type="text" value={widthValue} onChange={e => this.updateValue('widthValue', e.target.value)} />
        </Setting>
        <Setting>
          Number Of Mines:&nbsp;
          <SettingInput type="text" value={numberOfMinesValue} onChange={e => this.updateValue('numberOfMinesValue', e.target.value)} />
        </Setting>
        {this.generateButton()}
      </SettingsContainer>
    );
  }
}

Settings.propTypes = {
  boardHeight: propTypes.number.isRequired,
  boardWidth: propTypes.number.isRequired,
  numberOfMines: propTypes.number.isRequired,
  resetGame: propTypes.func.isRequired,
};

export default Settings;
