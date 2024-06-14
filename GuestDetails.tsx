import React, { Component, ChangeEvent, MouseEvent } from 'react';
import { Guest, parseGuest } from './guest';
import { isRecord } from './record';


type DetailsProps = {
  name: string,
  onBackClick: () => void,
};

type DetailsState = {
    now: number
    guest: Guest | undefined,
    error: string
    subGuest: boolean | undefined;
};

/**
 * Component for displaying the details of a guest.
 * @class GuestDetails
 * @extends Component
 */
export class GuestDetails extends Component<DetailsProps, DetailsState> {

    /**
     * Creates an instance of GuestDetails.
     * @constructor
     * @param {DetailsProps} props - The props for the component.
     */
    constructor(props: DetailsProps) {
        super(props);
        this.state = {now: Date.now(), guest: undefined, error: "", subGuest: undefined};
        //this.doRefreshClick
    }

    /**
     * Lifecycle method called when the component is first mounted.
     * Fetches the guest details and sets the state.
     * @method componentDidMount
     * @return {void}
     */
    componentDidMount = (): void => {
        this.doRefreshClick(); 
    };

    /**
     * Renders the component.
     * @method render
     * @return {JSX.Element} The rendered component.
     */
    render = (): JSX.Element => {
        if (this.state.guest === undefined) {
            return <p>Loading guest "{this.props.name}"...</p>
        } 
        else {
            if (this.state.guest.isFamily) {
                return this.renderGuestFam(this.state.guest);
            }
            else {
                return this.renderGuestNoFam(this.state.guest)
            }

        }
    };

    /**
     * Renders the details of a family guest.
     * @method renderGuestFam
     * @param {Guest} guest - The guest to render.
     * @return {JSX.Element} The rendered component.
     */
    renderGuestFam = (guest: Guest): JSX.Element => {
        if (this.state.guest === undefined) {
            return <p></p>
        }
        return (
            <div>
                <h2>Guest Details</h2>
                <p>{guest.name}, guest of {guest.relationship}, family </p>
                <p>Dietary Restrictions - 'none' if none:</p>
                <input id="diet" type="text" value={this.state.guest.diet}
                    onChange={this.doDietChange}></input>
                {this.renderAddSubGuest()}
                <br></br>
                <button type="button" onClick={this.doSaveClick}>Save</button>
                <button type="button" onClick={this.doDoneClick}>Back</button>
                {this.renderError()}
            </div>
        )
    }

    /**
     * Renders the details of a non-family guest.
     * @method renderGuestNoFam
     * @param {Guest} guest - The guest to render.
     * @return {JSX.Element} The rendered component.
     */
    renderGuestNoFam = (guest: Guest): JSX.Element => {
        if (this.state.guest === undefined) {
            return <p></p>
        }
        return (
            <div>
                <h2>Guest Details</h2>
                <p>{guest.name}, guest of {guest.relationship} </p>
                <p>Dietary Restrictions - 'none' if none:</p>
                <input id="diet" type="text" value={this.state.guest.diet}
                    onChange={this.doDietChange}></input>
                {this.renderAddSubGuest()}
                <br></br>
                <button type="button" onClick={this.doSaveClick}>Save</button>
                <button type="button" onClick={this.doDoneClick}>Back</button>
                {this.renderError()}
            </div>
        )
    } 
       
    renderAddSubGuest = (): JSX.Element => {
        return (
            <div>
                <p>Additional Guest?</p>
                <p>Current Status: {String(this.state.subGuest)}</p>
                <select name="additionalGuest" id="additionalGuest" onChange={this.doSubGuestChange}>
                    <option value="unknown" >Unknown</option>
                    <option value="yes" >Yes</option>
                    <option value="no">No</option>
                </select>
            </div>
        )
    }

    doSubGuestChange = (evt: ChangeEvent<HTMLSelectElement>): void => {
        if (evt.target.value === "yes") {
            this.setState({subGuest: true})
        }
        else {
            this.setState({subGuest: false})
        }
    }

    renderError = (): JSX.Element => {
        if (this.state.error.length === 0) {
          return <div></div>;
        } else {
          return (<div>
              <span><b>Error</b>: {this.state.error}</span>
            </div>);
        }
    }
    
      doRefreshClick = (): void => {
        if (this.state.guest !== undefined) {
            const args = { guest: this.state.guest.name, relationship: this.state.guest.relationship,
                isFamily: this.state.guest.isFamily, diet: this.state.guest.diet, subGuest: this.state.subGuest};
            fetch('/api/add', {
                    method: 'POST', body: JSON.stringify(args),
                    headers: {"Content-Type": "application/json"} })
                .then(this.doAddResp)
                .catch(() => this.doAddError("failed to connect to server"));
        }
        
        fetch("/api/get?name=" + encodeURIComponent(this.props.name))
          .then(this.doGetResp)
          .catch(() => this.doGetError("failed to connect to server"));
      };

      doGetResp = (res: Response): void => {
        if (res.status === 200) {
          res.json().then(this.doGetJson)
              .catch(() => this.doGetError("200 res is not JSON"));
        } else if (res.status === 400) {
          res.text().then(this.doGetError)
              .catch(() => this.doGetError("400 response is not text"));
        } else {
          this.doGetError(`bad status code from /api/get: ${res.status}`);
        }
      };
  
    doGetJson = (data: unknown): void => {
        if (!isRecord(data)) {
        console.error("bad data from /api/get: not a record", data);
        return;
        }

        this.doGuestChange(data);
    }

    doGuestChange = (data: {guest?: unknown}): void => {
        const guest = parseGuest(data.guest);
        if (guest !== undefined) {
            this.setState({guest, now: Date.now(), error: ""});
          
        } 
        else {
          console.error("auction from /api/get did not parse", data.guest)
        }
      };

    doGetError = (msg: string): void => {
        console.error(`Error fetching /api/get: ${msg}`);
      };

    doDoneClick = (_: MouseEvent<HTMLButtonElement>): void => {
        this.props.onBackClick();  // tell the parent to show the full list again
      };

    doBackClick = (_: MouseEvent<HTMLButtonElement>): void => {
        this.props.onBackClick();  // tell the parent this was clicked
    };

    doDietChange = (evt: ChangeEvent<HTMLInputElement>): void => {
        if (!(this.state.guest?.diet === undefined
            || this.state.guest.isFamily === undefined
            || this.state.guest.relationship === undefined
            || this.state.guest.name === undefined
        )) {
            const guestCopy: Guest = {name: this.state.guest?.name, 
                relationship: this.state.guest?.relationship, 
                isFamily: this.state.guest?.isFamily, 
                diet: evt.target.value, subGuest:this.state.guest.subGuest}
            this.setState({guest: guestCopy, error: ""});
        }
    }

    doSaveClick = (_:MouseEvent<HTMLButtonElement>): void => {
        
        if (this.state.guest?.diet === undefined
            || this.state.guest.isFamily === undefined
            || this.state.guest.relationship === undefined
            || this.state.guest.name === undefined
            || this.state.subGuest === undefined
        ) {
            this.setState({error: "All fields are required"}); 
                return;            
        }  

        // console.log(`Name: ${this.state.guest.name}, type: ${typeof(this.state.guest.name)}`);
        // console.log(`Relationship: ${this.state.guest.relationship}, type: ${typeof(this.state.guest.relationship)}`);
        // console.log(`Is Family: ${this.state.guest.isFamily}, type: ${typeof(this.state.guest.isFamily)}`);
        // console.log(`Diet:  ${this.state.guest.diet}, type: ${typeof(this.state.guest.diet)}`)

        const args = { name: this.state.guest.name, relationship: this.state.guest.relationship,
            isFamily: this.state.guest.isFamily, diet: this.state.guest.diet, subGuest: this.state.subGuest};
        
        fetch('/api/add', {
            method: 'POST', body: JSON.stringify(args),
            headers: {"Content-Type": "application/json"} })
        .then(this.doAddResp)
        .catch(() => this.doAddError("failed to connect to server"));
    };

    
    doAddResp = (resp: Response): void => {
        if (resp.status === 200) {
          resp.json().then(this.doAddJson)
              .catch(() => this.doAddError("200 response is not JSON"));
        } else if (resp.status === 400) {
          resp.text().then(this.doAddError)
              .catch(() => this.doAddError("400 response is not text"));
        } else {
          this.doAddError(`bad status code from /api/add: ${resp.status}`);
        }
      };

      doAddJson = (data: unknown): void => {
        if (!isRecord(data)) {
          console.error("bad data from /api/add: not a record", data);
          return;
        }
    
        this.props.onBackClick();  // show the updated list
      };
    
      doAddError = (msg: string): void => {
        this.setState({error: msg})
      };
    
    
}