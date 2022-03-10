import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { socket } from 'utils';
// import { dispatch } from 'redux';
// import { updatedRoom } from 'store/actions';
import API from '../../utils/apiRequests';
import buildLog from '../../utils/buildLog';
import Loading from '../../Components/Loading/Loading';
// import { isEqual } from 'lodash';

function withPopulatedRoom(WrappedComponent) {
  class PopulatedRoom extends Component {
    state = {
      loading: true,
      controlledBy: {},
    };

    componentDidMount() {
      this.cancelFetch = false;
      const { match } = this.props;
      API.getPopulatedById('rooms', match.params.room_id, false, true)
        .then((res) => {
          this.populatedRoom = res.data.result;
          this.populatedRoom.log = buildLog(
            this.populatedRoom.tabs,
            this.populatedRoom.chat
          );
          // this.populatedRoom.settings.controlByTab = true;
          const controlledBy = this.populatedRoom.tabs.reduce((acc, tab) => {
            acc[tab._id] = this.populatedRoom.settings.controlByTab
              ? tab.controlledBy
              : this.populatedRoom.tabs[0].controlledBy;
            return acc;
          }, {});
          this.setState({ controlledBy });
          if (!this.cancelFetch) this.setState({ loading: false });
        })
        .catch(() => {
          console.log(
            'we should probably just go back to the previous page? maybe display the error'
          );
        });

        socket.on('RECEIVED_UPDATED_ROOM_SETTINGS', (updatedSettings) => {
          this.populatedRoom.settings = updatedSettings;
        })
    }

    componentWillUnmount() {
      this.cancelFetch = true;
    }

    // sets the userid as the controller of tabId. If userid is null, no one is in control. If tabid is null, sets control for first tab of the room.
    setControlledBy = (tabId, userId) => {
      this.setState((prevState) => {
        const controlledBy = {};
        Object.keys(prevState.controlledBy).forEach(function(tab) {
          controlledBy[tab] = userId;
        });
        return {
          controlledBy: this.populatedRoom.settings.controlByTab
            ? { ...prevState.controlledBy, [tabId]: userId }
            : controlledBy,
        };
      });
    };

    releaseControl = (tabId) => {
      this.setControlledBy(tabId, null);
    };

    render() {
      const { history } = this.props;
      const { loading, controlledBy } = this.state;
      if (loading) {
        return <Loading message="Fetching your room..." />;
      }

      return (
        <WrappedComponent
          populatedRoom={this.populatedRoom}
          history={history}
          controlledBy={controlledBy}
          setControlledBy={this.setControlledBy}
          releaseControl={this.releaseControl}
        />
      );
    }
  }

  PopulatedRoom.propTypes = {
    match: PropTypes.shape({}).isRequired,
    history: PropTypes.shape({}).isRequired,
  };

  return PopulatedRoom;
}

export default withPopulatedRoom;
