/* eslint-disable import/prefer-default-export */
import styled from 'styled-components';

const SettingsContainer = styled.div`
  grid-area: settings;
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: space-around;
  background-color: rgba(181, 181, 181, 0.5);
`;

const Setting = styled.div`
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: space-between;
`;

const SettingInput = styled.input`
  width: 25px;
  height: 25px;
  vertical-align: center;
  font-size: .9rem;
`;

const SettingsButton = styled.button`
  width: 110px;
  height: 40px;
`;

export {
  SettingsContainer, Setting, SettingInput, SettingsButton,
};
