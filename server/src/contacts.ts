import * as path from "path";
const Datastore = require("nedb");

export interface IContact {
  _id?: number;
  name: string;
  email: string;
}

export class Worker {
  private db: Nedb;

  constructor() {
    this.db = new Datastore({
      filename: path.join(__dirname, "contacts.db"),
      autoload: true,
    });
  }

  /**
   * Lists all contacts.
   *
   * @return A promise that eventually resolves to an array of IContact objects.
   */
  public listContacts(): Promise<IContact[]> {
    console.log("Contacts.Worker.listContacts()");

    return new Promise((inResolve, inReject) => {
      this.db.find({}, (inError: Error, inDocs: IContact[]) => {
        if (inError) {
          console.log("Contacts.Worker.listContacts(): Error", inError);
          inReject(inError);
        } else {
          console.log("Contacts.Worker.listContacts(): Ok", inDocs);
          inResolve(inDocs);
        }
      });
    });
  }

  /**
   * Add a new contact.
   *
   * @param  inContact The contact to add.
   * @return           A promise that eventually resolves to an IContact object.
   */
  public addContact(inContact: IContact): Promise<IContact> {
    console.log("Contacts.Worker.addContact()", inContact);

    return new Promise((inResolve, inReject) => {
      this.db.insert(inContact, (inError: Error | null, inNewDoc: IContact) => {
        if (inError) {
          console.log("Contacts.Worker.addContact(): Error", inError);
          inReject(inError);
        } else {
          console.log("Contacts.Worker.addContact(): Ok", inNewDoc);
          inResolve(inNewDoc);
        }
      });
    });
  }

  /**
   * Delete a contact.
   *
   * @param  inID The ID of the contact to delete.
   * @return      A promise that eventually resolves to a string (null for success, or the error message for an error).
   */
  public deleteContact(inID: string): Promise<string> {
    console.log("Contacts.Worker.deleteContact()", inID);

    return new Promise((inResolve, inReject) => {
      this.db.remove({ _id: inID }, {}, (inError: Error | null, inNumRemoved: number) => {
        if (inError) {
          console.log("Contacts.Worker.deleteContact(): Error", inError);
          inReject(inError);
        } else {
          console.log("Contacts.Worker.deleteContact(): Ok", inNumRemoved);
          inResolve("");
        }
      });
    });
  }
}
