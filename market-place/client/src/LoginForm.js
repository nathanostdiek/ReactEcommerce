import React, {Component} from 'react'
import Container from 'react-bootstrap/Container';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import './Login.css';
import Form from 'react-bootstrap/Form';
import Button from 'react-bootstrap/Button';

//main form for the login, sends information to the server when submitted
class LoginForm extends Component {
    constructor(props){
        super(props);
        this.state = {
            username: "",
            password: "",
        };
        this.endpoint = "http://localhost:9000";
        this.handleChangePass = this.handleChangePass.bind(this);
        this.handleChangeUser = this.handleChangeUser.bind(this);
        this.handleSubmit = this.handleSubmit.bind(this);
        this.login = this.login.bind(this);
        this.login_api = this.login_api.bind(this);

    }

    //handles all the changes to the fields
    handleChangeUser(event) {
        this.setState({username: event.target.value})
    }

    handleChangePass(event){
        this.setState({password: event.target.value})
    }

    handleSubmit(event){
        event.preventDefault();
        this.login(this.state.username, this.state.password);
    }

    login(username, password){
        this.login_api(username, password);
    }

    //sends info to the server when submitted
    login_api(username, password) {
        let data = {
          "username": username,
          "password": password
        }
    
        fetch(this.endpoint + '/login', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify(data)
        })
        .then(res => res.json())
        .then(res => {
            if(res.success){
                this.props.changeUser(res.user);
            }
            else{
                document.getElementById("error_message").innerHTML=res.message
            }
        })
      }


    render() {
        return (
            <Container>
                <p id='error_message'></p>
                <Form onSubmit={this.handleSubmit}>
                    <Form.Group as={Row}>
                        <Form.Label className="p-1" column sm="4">
                            Username
                        </Form.Label>
                        <Col sm="8" >
                            <Form.Control type='text' placeholder='Username' id='login_username' value={this.state.username} onChange={this.handleChangeUser} required />
                        </Col>
                    </Form.Group>

                    <Form.Group as={Row}>
                        <Form.Label className="p-1" column sm="4">
                            Password
                        </Form.Label>
                        <Col sm="8" >
                            <Form.Control type='password' placeholder='Password' id='login_password' value={this.state.password} onChange={this.handleChangePass} required />
                        </Col>
                    </Form.Group>
                    <Row className="justify-content-center pb-1">
                        <Button type="submit">Login</Button>
                    </Row>
                </Form>
                
            </Container>
        );
    }
}

export default LoginForm;