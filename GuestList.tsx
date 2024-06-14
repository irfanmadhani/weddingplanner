import React, { Component, MouseEvent } from 'react';
import { isRecord } from './record';
import { Guest, parseGuest } from './guest';

type ListProps = {
  onNewClick: () => void,
  onGuestClick: (name: string) => void
};

type ListState = {
  now: number,  // current time when rendering
  guests: Guest[] | undefined,
  mollyGuestCount: bigint | undefined;
  jamesGuestCount: bigint | undefined;
  jamesFamCount: bigint | undefined
  mollyFamCount: bigint | undefined
};


// Shows the list of all guests
export class GuestList extends Component<ListProps, ListState> {

  constructor(props: ListProps) {
    super(props);
    this.state = {now: Date.now(), guests: undefined, mollyGuestCount: undefined, jamesGuestCount: undefined
    , jamesFamCount: undefined, mollyFamCount: undefined

    };
  }

  componentDidMount = (): void => {
    this.doRefreshClick()
  }

  componentDidUpdate = (_prevProps: ListProps, prevState: ListState): void => {
    if (prevState.mollyGuestCount !== this.state.mollyGuestCount) {
      console.log('Molly guest count updated:', this.state.mollyGuestCount);
    }
  };

  render = (): JSX.Element => {
    return (
      <div>
        <h2>Guest List</h2>
        {this.renderGuests()}
        <p>Summary:</p>
        {this.renderMSummary()}
        {this.renderJSummary()}
        <button type="button" onClick={this.doNewClick}>Add Guest</button>
        <br></br>
        <br></br>
        <h2>Other Wedding Info</h2>
        <a href='https://www.wikihow.life/Dress-For-a-Wedding#:~:text=Step%20your%20outfit%20up%20to,than%20underdress%20for%20the%20occasion.'>Wedding Attire</a>
        <br></br>
        <a href='https://www.theknot.com/content/wedding-gift-ideas'>Wedding Registry</a>
        <br></br>
        <a href='https://youtu.be/dQw4w9WgXcQ?si=RemgvX0VB1i-dob1'>Music Setlist</a>
      </div>);
  };

  renderMSummary = (): JSX.Element => {
    if (this.state.mollyGuestCount === undefined) {
      return <p>No guests of Molly attending</p>
    }
    return <p>{this.state.mollyGuestCount?.toString() || "Loading..."} guests of Molly - * 
    {this.state.mollyFamCount?.toString() || "0"} Family*</p>
  }

  renderJSummary = (): JSX.Element => {
    if (this.state.jamesGuestCount === undefined) {
      return <p>No guests of James attending</p>
    }
    return <p>{this.state.jamesGuestCount?.toString() || "Loading..."} guests of James - * 
    {this.state.jamesFamCount?.toString() || "0"} Family*</p>
  }


  doCountMResp = (count: string): void => {
    console.log("TYPE OF COUNT: " + typeof(count)); // Should be "string"
  
    if (count !== null) {
      const bigIntResp: bigint = BigInt(count); // Convert string back to BigInt
      console.log("STATE BEFORE: " + this.state.mollyGuestCount);
      console.log("COUNT: " + bigIntResp);
      this.setState({ mollyGuestCount: bigIntResp });
      console.log("STATE AFTER: " + this.state.mollyGuestCount);
    }
  };

  
  doCountJResp = (count: string): void => {
    console.log("TYPE OF COUNT: " + typeof(count)); // Should be "string"
  
    if (count !== null) {
      const bigIntResp: bigint = BigInt(count); // Convert string back to BigInt
      console.log("STATE BEFORE: " + this.state.jamesGuestCount);
      console.log("COUNT: " + bigIntResp);
      this.setState({ jamesGuestCount: bigIntResp });
      console.log("STATE AFTER: " + this.state.jamesGuestCount);
    }
  };

  doCountJFamResp = (count: string): void => {
    console.log("TYPE OF COUNT: " + typeof(count)); // Should be "string"
  
    if (count !== null) {
      const bigIntResp: bigint = BigInt(count); // Convert string back to BigInt
      console.log("STATE BEFORE: " + this.state.jamesFamCount);
      console.log("COUNT: " + bigIntResp);
      this.setState({ jamesFamCount: bigIntResp });
      console.log("STATE AFTER: " + this.state.jamesFamCount);
    }
  };

  doCountMFamResp = (count: string): void => {
    console.log("TYPE OF COUNT: " + typeof(count)); // Should be "string"
  
    if (count !== null) {
      const bigIntResp: bigint = BigInt(count); // Convert string back to BigInt
      console.log("STATE BEFORE: " + this.state.mollyFamCount);
      console.log("COUNT: " + bigIntResp);
      this.setState({ mollyFamCount: bigIntResp });
      console.log("STATE AFTER: " + this.state.mollyFamCount);
    }
  };

  doCountError = (msg: string): void => {
    console.log(msg);
  };

  renderGuests = (): JSX.Element => {
    if (this.state.guests === undefined) {
      return <p>Loading guest list...</p>;
    } else {
      const guests: JSX.Element[] = [];
      for (const guest of this.state.guests) {
        guests.push(
          <li key={guest.name}>
            <div><a href="#" onClick={(evt) => this.doGuestClick(evt, guest.name)}>{guest.name}</a> |   Guest of {guest.relationship}
            </div>
          </li>);
      }
      return <ul>{guests}</ul>;
    }
  };

  doListResp = (resp: Response): void => {
    if (resp.status === 200) {
      resp.json().then(this.doListJson)
          .catch(() => this.doListError("200 response is not JSON"));
    } else if (resp.status === 400) {
      resp.text().then(this.doListError)
          .catch(() => this.doListError("400 response is not text"));
    } else {
      this.doListError(`bad status code from /api/list: ${resp.status}`);
    }
  };

  doListJson = (data: unknown): void => {
    if (!isRecord(data)) {
      console.error("bad data from /api/list: not a record", data);
      return;
    }
    
    if (!Array.isArray(data.guest)) {
      console.error("bad data from /api/list: guests is not an array", data);
      return;
    }

    const guests: Guest[] = [];
    for (const val of data.guest) {
      const guest = parseGuest(val);
      if (guest === undefined)
        return;
      guests.push(guest);
    }
    this.setState({guests, now: Date.now()});  // fix time also
  };

  doListError = (msg: string): void => {
    console.error(`Error fetching /api/list: ${msg}`);
  };

  doRefreshClick = (): void => {
    fetch("/api/list").then(this.doListResp)
        .catch(() => this.doListError("failed to connect to server REFRESH"));
    fetch('/api/countM')
      .then(resp => resp.text())
      .then(this.doCountMResp)
      .catch(() => this.doCountError("failed to connect to server MOLLY"));
    fetch('/api/countMFam')
      .then(resp => resp.text())
      .then(this.doCountMFamResp)
      .catch(() => this.doCountError("failed to connect to server MOLLY"));
    fetch('/api/countJ')
      .then(resp => resp.text())
      .then(this.doCountJResp)
      .catch(() => this.doCountError("failed to connect to server JAMES"));
    fetch('/api/countJFam')
      .then(resp => resp.text())
      .then(this.doCountJFamResp)
      .catch(() => this.doCountError("failed to connect to server JAMES"));
  };

  doNewClick = (_evt: MouseEvent<HTMLButtonElement>): void => {
    this.props.onNewClick();  // tell the parent to show the new guest page
  };

  doGuestClick = (evt: MouseEvent<HTMLAnchorElement>, name: string): void => {
    evt.preventDefault();
    this.props.onGuestClick(name);
  };
}
