import React, { Component } from 'react';
import PropTypes from 'prop-types';
// import { dispatch } from 'redux';
// import { updatedRoom } from 'store/actions';
import API from '../../utils/apiRequests';
import buildLog from '../../utils/buildLog';
import Loading from '../../Components/Loading/Loading';

function withPopulatedRoom(WrappedComponent) {
  class PopulatedRoom extends Component {
    state = {
      loading: true,
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
          if (!this.cancelFetch) this.setState({ loading: false });
        })
        .catch(() => {
          console.log(
            'we should probably just go back to the previous page? maybe display the error'
          );
        });
    }

    componentWillUnmount() {
      this.cancelFetch = true;
    }

    // For a given tab, returns the userID of who is in control. If tabid is null, returns the person in control of the first tab. If no one in control, returns null.
    getControlledBy = (tabId) => {
      return this.populatedRoom && this.populatedRoom.controlledBy;
    };

    // sets the userid as the controller of tabId. If userid is null, no one is in control. If tabid is null, sets control for first tab of the room.
    setControlledBy = (tabId, userId) => {
      this.populatedRoom.controlledBy = userId;
      // dispatch(updatedRoom(this.populatedRoom._id, { controlledBy: userId }));
      API.put('rooms', this.populatedRoom._id, { controlledBy: userId });
    };

    releaseControl = (tabId) => {
      this.setControlledBy(tabId, null);
    };

    render() {
      const { history } = this.props;
      const { loading } = this.state;
      if (loading) {
        return <Loading message="Fetching your room..." />;
      }

      return (
        <WrappedComponent
          populatedRoom={this.populatedRoom}
          history={history}
          getControlledBy={this.getControlledBy}
          setControlledBy={this.setControlledBy}
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
