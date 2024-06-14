import React, { Component } from "react";
import { GuestList } from "./GuestList";
import { NewGuest } from "./NewGuest";
import { GuestDetails } from "./GuestDetails";


// TODO: When you're ready to get started, you can remove all the example 
//   code below and start with this blank application:

// Indicates which page to show. If it is the details page, the argument
// includes the specific wedding guest to show the details of.
type Page = "list" | "new" | {kind: "details", name: string};

// Whether to show debugging info in the console.
const DEBUG: boolean = false;

// RI: If page is "details", then index is a valid index into guest list array.
type WeddingAppState = {
  page: Page
};

// Top level component that displays the appropriate page.
export class WeddingApp extends Component<{}, WeddingAppState> {

  constructor(props: {}) {
    super(props);
    this.state = {page: "list"};
  }
  
  render = (): JSX.Element => {
    if (this.state.page === 'list') {
      return <GuestList onNewClick={this.doNewClick}
                        onGuestClick={this.doGuestClick}/>
    }
    else if (this.state.page === 'new') {
      return <NewGuest onBackClick={this.doBackClick}/>
    }
    else {
      return <GuestDetails name={this.state.page.name}
                          onBackClick={this.doBackClick}/>
    }
  };

  doNewClick = (): void => {
    if (DEBUG) console.debug("set state to new");
    this.setState({page: "new"});
  };
  
  doGuestClick = (name: string): void => {
    if (DEBUG) console.debug(`set state to details for guest ${name}`);
    this.setState({page: {kind: "details", name}});
  };
  
  doBackClick = (): void => {
    if (DEBUG) console.debug("set state to list");
    this.setState({page: "list"});
  };
}