import NewContactIcon from "@mui/icons-material/ContactMail";
import NewMessageIcon from "@mui/icons-material/Email";
import Button from "@mui/material/Button";
import React from "react";

/**
 * Toolbar.
 */
const Toolbar = ({ state }): JSX.Element => (
  <div>
    <Button
      variant="contained"
      color="primary"
      size="small"
      style={{ marginRight: 10 }}
      onClick={() => state.showComposeMessage("new")}
    >
      <NewMessageIcon style={{ marginRight: 10 }} />
      New Message
    </Button>
    <Button
      variant="contained"
      color="primary"
      size="small"
      style={{ marginRight: 10 }}
      onClick={state.showAddContact}
    >
      <NewContactIcon style={{ marginRight: 10 }} />
      New Contact
    </Button>
  </div>
);

export default Toolbar;
