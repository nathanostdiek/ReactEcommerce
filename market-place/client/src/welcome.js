import React, {Component} from 'react';

class Welcome extends Component{
    constructor(props){
        super(props);
        this.state = {
            currentUser: this.props.user
        };
    }

    render (){
        return (
            <div>
                <div className="welcome">
                <h2>Market Place</h2>
            </div>
            <div className="user-name">
                <p>Welcome {this.props.user}</p>
            </div>
            </div>        
        );
    }
}

export default Welcome;