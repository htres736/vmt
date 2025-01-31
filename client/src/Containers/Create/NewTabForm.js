import React, { useState } from 'react';
import PropTypes from 'prop-types';
import { TextInput, RadioBtn, Button } from 'Components';
import { TabTypes } from 'Model';
import { API, createMongoId } from 'utils';
import { extractActivityCode } from 'Containers/Workspace/Tools/DesActivityHelpers';
import classes from './newTabForm.css';

function NewTabForm({
  room,
  user,
  activity,
  updatedActivity,
  sendEvent,
  setTabs,
  closeModal,
  currentTabs,
  currentTabId,
}) {
  const CLONE = 'clone';
  const appName = 'classic';
  const [name, setName] = useState('');
  const [instructions, setInstructions] = useState('');
  const [desmosLink, setDesmosLink] = useState('');
  const [tabType, setTabType] = useState(CLONE);
  const [errorMessage, setErrorMessage] = useState(null);
  const [displayLink, setDisplayLink] = useState('');

  const onKeyDown = (event) => {
    if (event.key === 'Enter') {
      event.preventDefault();
      event.stopPropagation();
      submit();
    }
  };

  const requestURL = (type) => {
    switch (type) {
      case TabTypes.DESMOS_ACTIVITY:
        return 'Desmos Activity Code or URL';
      case TabTypes.PYRET:
        return 'Published URL';
      default:
        return null;
    }
  };

  const clearForm = () => {
    setName('');
    setInstructions('');
    setDesmosLink('');
    setTabType(CLONE);
    setErrorMessage(null);
    setDisplayLink('');
  };

  const handleUpdateLink = (type, value) => {
    switch (type) {
      case TabTypes.DESMOS_ACTIVITY: {
        const code = extractActivityCode(value);
        setDesmosLink(code);
        break;
      }
      case TabTypes.PYRET:
        setDesmosLink(value);
        break;
      default:
    }
    setDisplayLink(value);
  };

  const submit = async () => {
    if (name.trim().length < 1) {
      setErrorMessage('Please provide a name for the tab');
      return;
    }

    const tabFromDB = await API.getById('tabs', currentTabId);
    const currentTab = await tabFromDB.data.result;
    const newTab =
      tabType === CLONE
        ? { ...currentTab, name, events: [], _id: createMongoId() }
        : {
            name,
            desmosLink,
            ...(tabType === TabTypes.PYRET
              ? {
                  currentStateBase64: desmosLink, // used by rooms
                  startingPointBase64: desmosLink, // used by rooms & templates
                }
              : {}),
            appName,
            instructions,
            tabType,
            room: room ? room._id : null,
            activity: activity ? activity._id : null,
            _id: createMongoId(),
          };
    // why are we doing this for all tab types?
    API.post('tabs', newTab).then((res) => {
      let tabs;
      if (room) {
        tabs = [...currentTabs];
        tabs.push(res.data.result);
        setTabs(tabs);
        newTab.creator = {
          username: user.username,
          _id: user._id,
        };
        newTab.message = {
          text: `${newTab.creator.username} created a new tab`,
          room: room._id,
          autogenerated: true,
          messageType: 'NEW_TAB',
          timestamp: Date.now(),
        };
        newTab._id = res.data.result._id;
        if (sendEvent) {
          sendEvent(newTab);
        }
      } else {
        tabs = [...activity.tabs];
        tabs.push(res.data.result);
        // UPDATE REDUX ACTIVITY
        updatedActivity(activity._id, { tabs });
      }
      clearForm();
      closeModal();
    });
  };

  return (
    <div className={classes.NewTabModal}>
      <h2>Create A New Tab</h2>
      <TextInput
        light
        value={name}
        change={(event) => {
          setName(event.target.value);
          setErrorMessage(null);
        }}
        onKeyDown={onKeyDown}
        name="name"
        label="Name"
        autofill="none"
      />
      {errorMessage ? (
        <div className={classes.ErrorMessage}>{errorMessage}</div>
      ) : null}
      <TextInput
        light
        value={instructions}
        change={(event) => {
          setInstructions(event.target.value);
          setErrorMessage(null);
        }}
        onKeyDown={onKeyDown}
        name="instructions"
        label="Instructions"
      />
      <div style={{ margin: '30px 0 20px 0' }}>
        <div className={classes.RadioGroup}>
          <RadioBtn
            name={CLONE}
            checked={tabType === CLONE}
            check={() => setTabType(CLONE)}
          >
            Clone Current Tab
          </RadioBtn>
        </div>
        <div className={classes.RadioGroup}>
          <TabTypes.RadioButtons onClick={setTabType} checked={tabType} />
        </div>
      </div>
      {requestURL(tabType) && (
        <TextInput
          light
          value={displayLink}
          change={(event) => handleUpdateLink(tabType, event.target.value)}
          name="desmosLink"
          label={requestURL(tabType)}
        />
      )}
      <Button m={10} click={submit} data-testid="create-tab">
        Create
      </Button>
    </div>
  );
}

NewTabForm.propTypes = {
  room: PropTypes.shape({
    tabs: PropTypes.arrayOf(PropTypes.shape({})),
    _id: PropTypes.string,
  }),
  user: PropTypes.shape({ _id: PropTypes.string, username: PropTypes.string })
    .isRequired,
  activity: PropTypes.shape({
    _id: PropTypes.string,
    tabs: PropTypes.arrayOf(PropTypes.shape({})),
  }),
  updatedActivity: PropTypes.func,
  sendEvent: PropTypes.func,
  closeModal: PropTypes.func.isRequired,
  setTabs: PropTypes.func, // not used for activities
  currentTabs: PropTypes.arrayOf(PropTypes.shape({})), // not used for activities
  currentTabId: PropTypes.string,
};

NewTabForm.defaultProps = {
  room: null,
  updatedActivity: null,
  sendEvent: null,
  activity: null,
  setTabs: null,
  currentTabs: null,
  currentTabId: null,
};
export default NewTabForm;
