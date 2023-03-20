import { ParsedMail } from "mailparser";
const ImapClient = require("emailjs-imap-client");
import { simpleParser } from "mailparser";
import { IServerInfo } from "./ServerInfo";

export interface ICallOptions {
  mailbox: string;
  id?: number;
}

export interface IMessage {
  id: string;
  date: string;
  from: string;
  subject: string;
  body?: string;
}

export interface IMailbox {
  name: string;
  path: string;
}

// Disable certificate validation (less secure, but needed for some servers).
process.env.NODE_TLS_REJECT_UNAUTHORIZED = "0";

export class Worker {
  private static serverInfo: IServerInfo;

  constructor(inServerInfo: IServerInfo) {
    console.log("IMAP.Worker.constructor", inServerInfo);
    Worker.serverInfo = inServerInfo;
  }

  /**
   * Connect to the SMTP server and return a client object for operations to use.
   *
   * @return An ImapClient instance.
   */
  private async connectToServer(): Promise<any> {
    const client: any = new ImapClient.default(
      Worker.serverInfo.imap.host,
      Worker.serverInfo.imap.port,
      { auth: Worker.serverInfo.imap.auth }
    );
    client.logLevel = client.LOG_LEVEL_NONE;
    client.onerror = (inError: Error) => {
      console.log("IMAP.Worker.listMailboxes(): Connection error", inError);
    };
    await client.connect();
    console.log("IMAP.Worker.listMailboxes(): Connected");

    return client;
  }

  /**
   * Returns a list of all (top-level) mailboxes.
   *
   * @return An array of objects, on per mailbox, that describes the mailbox.
   */
  public async listMailboxes(): Promise<IMailbox[]> {
    console.log("IMAP.Worker.listMailboxes()");

    const client: any = await this.connectToServer();

    const mailboxes: any = await client.listMailboxes();

    await client.close();

    // Translate from emailjs-imap-client mailbox objects to app-specific objects.  At the same time, flatten the list
    // of mailboxes via recursion.
    const finalMailboxes: IMailbox[] = [];
    const iterateChildren: Function = (inArray: any[]): void => {
      inArray.forEach((inValue: any) => {
        finalMailboxes.push({
          name: inValue.name,
          path: inValue.path,
        });
        iterateChildren(inValue.children);
      });
    };
    iterateChildren(mailboxes.children);

    return finalMailboxes;
  }

  /**
   * Lists basic information about messages in a named mailbox.
   *
   * @param inCallOptions An object implementing the ICallOptions interface.
   * @return              An array of objects, one per message.
   */
  public async listMessages(inCallOptions: ICallOptions): Promise<IMessage[]> {
    console.log("IMAP.Worker.listMessages()", inCallOptions);

    const client: any = await this.connectToServer();

    // We have to select the mailbox first.  This gives us the message count.
    const mailbox: any = await client.selectMailbox(inCallOptions.mailbox);
    console.log(`IMAP.Worker.listMessages(): Message count = ${mailbox.exists}`);

    // If there are no messages then just return an empty array.
    if (mailbox.exists === 0) {
      await client.close();
      return [];
    }

    // Okay, there are messages, let's get 'em!  Note that they are returned in order by uid, so it's FIFO.
    // noinspection TypeScriptValidateJSTypes
    const messages: any[] = await client.listMessages(inCallOptions.mailbox, "1:*", [
      "uid",
      "envelope",
    ]);

    await client.close();

    // Translate from emailjs-imap-client message objects to app-specific objects.
    const finalMessages: IMessage[] = [];
    messages.forEach((inValue: any) => {
      finalMessages.push({
        id: inValue.uid,
        date: inValue.envelope.date,
        from: inValue.envelope.from[0].address,
        subject: inValue.envelope.subject,
      });
    });

    return finalMessages;
  }

  /**
   * Gets the plain text body of a single message.
   *
   * @param  inCallOptions An object implementing the ICallOptions interface.
   * @return               The plain text body of the message.
   */
  public async getMessageBody(inCallOptions: ICallOptions): Promise<string | undefined> {
    console.log("IMAP.Worker.getMessageBody()", inCallOptions);

    const client: any = await this.connectToServer();

    const messages: any[] = await client.listMessages(
      inCallOptions.mailbox,
      inCallOptions.id,
      ["body[]"],
      { byUid: true }
    );
    const parsed: ParsedMail = await simpleParser(messages[0]["body[]"]);

    await client.close();

    return parsed.text;
  }

  /**
   * Deletes a single message.
   *
   * @param inCallOptions An object implementing the ICallOptions interface.
   */
  public async deleteMessage(inCallOptions: ICallOptions): Promise<any> {
    console.log("IMAP.Worker.deleteMessage()", inCallOptions);

    const client: any = await this.connectToServer();

    await client.deleteMessages(inCallOptions.mailbox, inCallOptions.id, { byUid: true });

    await client.close();
  }
}
