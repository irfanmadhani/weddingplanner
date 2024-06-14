import React, { Component, ChangeEvent, MouseEvent } from 'react';
import { isRecord } from './record';

type NewGuestProps = {
    onBackClick: () => void
};

type NewGuestState = {
    name: string;
    isFamily: boolean;
    relationship: string;
    diet: string;
    error: string;
}

export class NewGuest extends Component<NewGuestProps, NewGuestState> {

    constructor(props: NewGuestProps) {
        super(props);
        this.state = {name: "", isFamily: false, relationship: "", diet: "", error: ""};
    }

    render = (): JSX.Element => {
        return (
            <div>
                <h2>Add Guest</h2>
                <label htmlFor="name">Name:</label>
                <input id="name" type="text" value={this.state.name}
                    onChange={this.doNameChange}></input>

                <p><b>Guest of:</b></p>
                <label htmlFor="relationship">James</label>
                <input id="relationship" type="radio" 
                value="James" onChange={this.doRelationshipChange}></input>
                <br></br>
                <label htmlFor="relationship">Molly</label>
                <input id="relationship" type="radio" 
                value="Molly" onChange={this.doRelationshipChange}></input>

                <br></br>
                <br></br>
                <label htmlFor="name">Family?:</label>
                <input id="isFamily" type='checkbox' onChange={this.doIsFamilyChange}></input>
                <br></br>
                <br></br>
                
                <button type="button" onClick={this.doAddClick}>Add</button>
                <button type="button" onClick={this.doBackClick}>Back</button>

                {this.renderError()}
            </div>
        )
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

    doNameChange = (evt: ChangeEvent<HTMLInputElement>): void => {
        this.setState({name: evt.target.value, error: ""});
    };

    doRelationshipChange = (evt: ChangeEvent<HTMLInputElement>): void => {
        this.setState({relationship: evt.target.value, error: ""});
    };

    doIsFamilyChange = (_evt: ChangeEvent<HTMLInputElement>): void => {
        this.setState({isFamily: true, error: ""});
    };

    doAddClick = (_:MouseEvent<HTMLButtonElement>): void => {
        console.log(`Name: ${this.state.name}, type: ${typeof(this.state.name)}`);
        console.log(`Relationship: ${this.state.relationship}, type: ${typeof(this.state.relationship)}`);
        console.log(`Is Family: ${this.state.isFamily}, type: ${typeof(this.state.isFamily)}`);
        console.log(`Diet:  ${this.state.diet}, type: ${typeof(this.state.diet)}`)
        if (this.state.name.trim().length === 0 ||
            this.state.relationship.trim().length === 0 ||
            this.state.isFamily === undefined) {
                this.setState({error: "All fields are required"}); 
                return;
        }

        const args = { name: this.state.name, relationship: this.state.relationship,
                       isFamily: this.state.isFamily, diet: "", subGuest: false};

                           
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
    
      doBackClick = (_: MouseEvent<HTMLButtonElement>): void => {
        this.props.onBackClick();  // tell the parent this was clicked
      };
}
