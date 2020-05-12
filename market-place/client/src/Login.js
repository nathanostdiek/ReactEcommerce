import React, {Component} from 'react'
import Container from 'react-bootstrap/Container';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import './Login.css';
import LoginBlock from './LoginBlock.js'
//component with the login information

class Login extends Component {
    constructor(props){
        super(props);
        this.state = {
            currentUser: this.props.user,
            showmod: false //decides if the login block should be displayed
        };
    }


    render(){

        return (
            <Container>
                    <Row className="h-100">
                        <Col sm={7} md={6} lg={5} className="align-self-center mx-auto">
                            <LoginBlock 
                                changeUser={this.props.changeUser}
                                asGuest={this.props.asGuest}
                            />
                            
                        </Col>
                    </Row>
            </Container>
        );
    }
}


export default Login;