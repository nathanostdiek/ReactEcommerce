import React, {Component} from 'react';
import NavBar from './NavBar.js';
import Container from 'react-bootstrap/Container'
import Feed from './Feed.js';
import MainItemView from './MainItemView.js';


//similar to main page but for a guest
class GuestView extends Component {
    constructor(props){
        super(props);
        this.state = {
            currentUser: this.props.currentUser,
            itemDisplay: false,
            mainItemView: null,
        };
        this.changeView = this.changeView.bind(this);
    }

    changeView(item){
        this.setState({
            itemDisplay: !this.state.itemDisplay,
            mainItemView: item
        })
    }


    render(){

        if(this.state.itemDisplay){
            return(
                <Container>
                    <NavBar 
                        currentUser={this.props.currentUser} 
                        logout={this.props.logout}/>

                    <MainItemView 
                        item = {this.state.mainItemView}
                        currentUser={this.props.currentUser}
                        changeView={this.changeView}
                    />
                </Container>
            );
        }
        else {
            return (
                <Container>
                    <NavBar 
                        currentUser={this.props.currentUser} 
                        logout={this.props.logout}/>
                    <Feed 
                        currentUser={this.state.currentUser}
                        changeView={this.changeView}
                    />
                </Container>
            );
        }
    }

}

export default GuestView;