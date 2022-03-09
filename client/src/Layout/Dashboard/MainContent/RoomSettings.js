import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { RadioBtn, Button } from '../../../Components';
import { Loading } from '../../../Components';
import classes from './roomSettings.css';

class RoomSettings extends Component {
  state = {
    loading: true,
    createTabsState: this.props.settings.participantsCanCreateTabs,
    controlTabsState: this.props.settings.controlByTab,
  }

  toggleCreateTabs = () => {
    this.setState((prevState) => ({
      createTabsState: !prevState.createTabsState
    }));
  }

  toggleTabControl = () => {
    this.setState((prevState) => ({
      controlTabsState: !prevState.controlTabsState
    }));
  }

  submit = () => {
    const { createTabsState, controlTabsState } = this.state;
    const { roomId, settings, updateRoom } = this.props;
    const updatedSettings = { ...settings };
    updatedSettings.controlByTab = controlTabsState;
    updatedSettings.participantsCanCreateTabs = createTabsState;
    updateRoom(roomId, { settings: updatedSettings });
  }

  // togglePerspective = () => {
  //   const { roomId, settings, updateRoom } = this.props;

  //   const updatedSettings = { ...settings };
  //   updatedSettings.participantsCanChangePerspective = !settings.participantsCanChangePerspective;
  //   updateRoom(roomId, { settings: updatedSettings });
  // };

  // toggleTabControl = () => {
  //   const { roomId, settings, updateRoom } = this.props;
  //   const updatedSettings = { ...settings };
  //   updatedSettings.controlByTab = !settings.controlByTab;
  //   updateRoom(roomId, { settings: updatedSettings });

  // }

  render() {
    const { createTabsState, controlTabsState, loading } = this.state;
    const { settings, owner } = this.props;

    // if (loading) {
    //   return <Loading message="Configuring your settings..." />
    // }

    return owner ? (
      <div className={classes.SettingsContainer}>
        <div>
          <h2 className={classes.Heading}>Participants can create new Tabs</h2>
          <RadioBtn
            name="createTabs"
            check={this.toggleCreateTabs}
            checked={createTabsState === true}
          >
            Yes
          </RadioBtn>
          <RadioBtn
            name="createTabs"
            check={this.toggleCreateTabs}
            checked={createTabsState === false}
          >
            No
          </RadioBtn>
        </div>

        <div>
          <h2 className={classes.Heading}>Enable Independent Tab Control</h2>
          <RadioBtn
            name="controlByTab"
            check={this.toggleTabControl}
            checked={controlTabsState === true}
          >
            Yes
          </RadioBtn>
          <RadioBtn
            name="controlByTab"
            check={this.toggleTabControl}
            checked={controlTabsState === false}
          >
            No
          </RadioBtn>
        </div>
        <div>
          <Button click={this.submit}>
            Update Room Settings
          </Button>
        </div>

        {/* Ggb perspective option set to disabled for now */}
        {/* <h2 className={classes.Heading}>
          Participants can change the perspective (GeoGebra)
        </h2>
        <RadioBtn
          name="changePerspective"
          checked={settings.participantsCanChangePerspective === true}
          check={this.togglePerspective}
        >
          Yes
        </RadioBtn>
        <RadioBtn
          name="changePerspective"
          checked={settings.participantsCanChangePerspective === false}
          check={this.togglePerspective}
        >
          No
        </RadioBtn> */}
        {/* Control specificity not yet added TODO */}
        {/* <h2 className={classes.Heading}>Control Specificity</h2>
        <RadioBtn name="yes" checked={settings.controlByRoom === false}>
          Room
        </RadioBtn>
        <RadioBtn name="No" checked={settings.controlByTab === true}>
          Tab
        </RadioBtn> */}
      </div>
    ) : (
      <div className={classes.SettingsContainer}>
        <div>
          <h2 className={classes.Heading}>Participants can create new Tabs</h2>
          <div>{settings.participantsCanCreateTabs ? 'Yes' : 'No'}</div>
        </div>
        <div>
          <h2 className={classes.Heading}>Individual Tabs can be controlled by Unique Participants</h2>
          <div>{settings.controlByTab ? 'Yes' : 'No'}</div>
        </div>
        {/* <h2 className={classes.Heading}>
          Participants can change the Perspective (GeoGebra)
        </h2>
        <div>{settings.participantsCanChangePerspective ? 'Yes' : 'No'}</div> */}
      </div>
    );
  }
}

RoomSettings.propTypes = {
  roomId: PropTypes.string.isRequired,
  settings: PropTypes.shape({}).isRequired,
  owner: PropTypes.bool.isRequired,
  updateRoom: PropTypes.func.isRequired,
};
export default RoomSettings;
