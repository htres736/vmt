import React from 'react';
import classes from './chat.css';
import moment from 'moment';
const Message = React.forwardRef((props, ref) => {
  let { message, click, highlighted, key, referencing } = props;
  let highlightClass = '';
  if (highlighted) {
    highlightClass = classes.Highlight;
  }
  if (message) {
    return (
      <div
        id={message._id}
        key={key}
        ref={ref}
        className={[
          message.autogenerated ? classes.VmtBotEntry : classes.Entry,
          highlightClass,
        ].join(' ')}
        onClick={click}
        style={{
          cursor: message.reference || referencing ? 'pointer' : 'auto',
          color: message.color,
        }}
      >
        <div>
          <b>{message.autogenerated ? 'VMTbot' : message.user.username}: </b>
          <span>{message.text}</span>
        </div>
        {/* CONSIDER CONDITIONALLLY FORMATIING THE DATE BASED ON HOW FAR IN THE PAST IT IS
              IF IT WAS LAST WEEK, SAYING THE DAY AND TIME IS MISLEADING */}
        <div className={classes.Timestamp}>
          {moment.unix(message.timestamp / 1000).format('ddd h:mm:ss a')}
        </div>
      </div>
    );
  } else return null;
});

export default Message;