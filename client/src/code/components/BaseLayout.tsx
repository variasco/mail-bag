import Dialog from "@mui/material/Dialog";
import DialogContent from "@mui/material/DialogContent";
import DialogContentText from "@mui/material/DialogContentText";
import DialogTitle from "@mui/material/DialogTitle";
import React, { Component } from "react";
import { createState } from "../state";
import ContactList from "./ContactList";
import ContactView from "./ContactView";
import MailboxList from "./MailboxList";
import MessageList from "./MessageList";
import MessageView from "./MessageView";
import Toolbar from "./Toolbar";
import WelcomeView from "./WelcomeView";

/**
 * BaseLayout.
 */
class BaseLayout extends Component {
  /**
   * State data for the app.  This also includes all mutator functions for manipulating state.  That way, we only
   * ever have to pass this entire object down through props (not necessarily the best design in terms of data
   * encapsulation, but it does have the benefit of being quite a bit simpler).
   */
  state: any = createState(this);

  /**
   * Render().
   */
  render(): JSX.Element {
    return (
      <div className="appContainer">
        <Dialog
          open={this.state.pleaseWaitVisible}
          disableEscapeKeyDown={true}
          transitionDuration={0}
          onClose={(inEvent, inReason) => {
            if (inReason !== "backdropClick") {
              this.state.showHidePleaseWait(false);
            }
          }}
        >
          <DialogTitle style={{ textAlign: "center" }}>Please Wait</DialogTitle>
          <DialogContent>
            <DialogContentText>...Contacting server...</DialogContentText>
          </DialogContent>
        </Dialog>

        <div className="toolbar">
          <Toolbar state={this.state} />
        </div>

        <div className="mailboxList">
          <MailboxList state={this.state} />
        </div>

        <div className="centerArea">
          <div className="messageList">
            <MessageList state={this.state} />
          </div>
          <div className="centerViews">
            {this.state.currentView === "welcome" && <WelcomeView />}
            {(this.state.currentView === "message" || this.state.currentView === "compose") && (
              <MessageView state={this.state} />
            )}
            {(this.state.currentView === "contact" || this.state.currentView === "contactAdd") && (
              <ContactView state={this.state} />
            )}
          </div>
        </div>

        <div className="contactList">
          <ContactList state={this.state} />
        </div>
      </div>
    );
  }
}

export default BaseLayout;
