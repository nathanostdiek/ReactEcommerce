import React, {Component} from 'react'
import './NavBar.css'
import Container from 'react-bootstrap/Container';
import Navbar from 'react-bootstrap/Navbar';
import Button from 'react-bootstrap/Button';
import Nav from 'react-bootstrap/Nav';
import AddItem from './AddItem.js'
import NavLink from 'react-bootstrap/NavLink';

//navbar at the top of the page
class NavBar extends Component {
    constructor(props){
        super(props);
        this.state = {
            currentUser: this.props.currentUser,
            constructed: true,
            guest:this.props.guest,
            displayaddform: false
        };
    }

    //displays form on click button
    addform = () => {
        this.setState({
            displayaddform: !this.state.displayaddform
        })
    }

    render(){

        return (
            <Container>
                <Navbar bg="light">
                    <Navbar.Brand id="navbar-title">
                        Market Place
                    </Navbar.Brand>

                    <Navbar.Text>
                        Welcome {this.state.guest ? "Guest User - Create an account to buy and sell items" : this.props.currentUser.name}
                    </Navbar.Text>
                    <Nav className="mr-auto">
                    {!this.state.guest && 
                    <>
                        <NavLink onClick={() => this.props.viewAccount()}>Account</NavLink>
                    </>
                    }
                     </Nav>
                     {/* dont let the guests add an item */}
                     {!this.state.guest &&
                        <Button onClick={this.addform}>Add Item To Sell</Button>
                     }
                    <Button variant='dark' className="float-right" onClick={this.props.logout}>Logout</Button>
                </Navbar>
                <AddItem 
                    currentUser={this.props.currentUser}
                    form={this.state.displayaddform}
                    updateItems={this.props.updateItems}
                    />
            </Container>
        );
    }

}

export default NavBar;