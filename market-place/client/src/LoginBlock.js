import React, {Component} from 'react'
import Container from 'react-bootstrap/Container';
import Row from 'react-bootstrap/Row';
import Card from 'react-bootstrap/Card';
import './Login.css';
import LoginForm from './LoginForm.js';
import Button from 'react-bootstrap/Button';
import CreateAccountModal from './CreateAccountModal.js';

//form for the login
class LoginBlock extends Component {
    constructor(props){
        super(props);
        this.state = {
            modalShow: false
        };
        this.setModalShow = this.setModalShow.bind(this);
    }

    //toggles the show
    setModalShow(state){
        this.setState({
            modalShow: state
        });
    }
    render() {
        return (
            <Container>
                <Card className="text-center login-card">
                    <Card.Body>
                        <Card.Title className="p-1">
                            Login
                        </Card.Title>

                        <LoginForm 
                            changeUser={this.props.changeUser}
                        />

                        <Row className="justify-content-center pb-1">
                            <Button onClick={() => this.setModalShow(true)}>Sign Up</Button>
                        </Row>
                        <Row className="justify-content-center pb-1">
                            <Button onClick={this.props.asGuest}>Continue as Guest</Button>
                        </Row>

                    </Card.Body>
                </Card>
                
                {/* gets displayed if create account gets clicked */}
                <CreateAccountModal 
                    show = {this.state.modalShow}
                    onHide={() => this.setModalShow(false)}
                    changeUser={this.props.changeUser}
                    
                />

            </Container>
        );
    }
}

export default LoginBlock;