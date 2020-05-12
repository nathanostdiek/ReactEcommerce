import React, {Component} from 'react'
import Container from 'react-bootstrap/Container';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import './Login.css';
import Form from 'react-bootstrap/Form';
import Button from 'react-bootstrap/Button';


//form to create an account. refractored from past labs for react
class CreateAccountForm extends Component {
    constructor(props){
        super(props);
        this.state = {
            username: "",
            password: "",
            cpassword:""
        };
    }


    render() {
        return (
            <Container>
                <Form >

                    {/* enter the username */}
                    <Form.Group as={Row}>
                        <Form.Label className="p-1" column sm="4">
                            Username
                        </Form.Label>
                        <Col sm="8" >
                            <Form.Control type='text' placeholder='Username' id='new_username' name='username'  onChange={(e) => this.props.handleChange(e, "username")} required />
                        </Col>
                    </Form.Group>

                    {/* passowrd */}
                    <Form.Group as={Row}>
                        <Form.Label className="p-1" column sm="4">
                            Password
                        </Form.Label>
                        <Col sm="8" >
                            <Form.Control type='password' placeholder='Password' id='new_password' name='password' onChange={(e) => this.props.handleChange(e, "password")} required />
                        </Col>
                    </Form.Group>

                    {/* confirm the password */}
                    <Form.Group as={Row}>
                        <Form.Label className="p-1" column sm="4">
                            Confirm Password
                        </Form.Label>
                        <Col sm="8" >
                            <Form.Control type='password' placeholder='Confirm Password' id='cpassword' name='cpassword' onChange={(e) => this.props.handleChange(e, "cpassword")} required />
                        </Col>
                    </Form.Group>
                    
                </Form>
                
            </Container>
        );
    }
}

export default CreateAccountForm;