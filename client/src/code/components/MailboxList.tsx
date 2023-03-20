import Chip from "@mui/material/Chip";
import List from "@mui/material/List";
import React from "react";

/**
 * Mailboxes.
 */
const MailboxList = ({ state }): JSX.Element => (
  <List>
    {state.mailboxes.map((value) => {
      return (
        <Chip
          label={`${value.name}`}
          onClick={() => state.setCurrentMailbox(value.path)}
          style={{ width: 128, marginBottom: 10 }}
          color={state.currentMailbox === value.path ? "secondary" : "primary"}
        />
      );
    })}
  </List>
);

export default MailboxList;
