import React, {Component} from 'react'
import Container from 'react-bootstrap/Container';
import './Login.css';
import Button from 'react-bootstrap/Button';
import Modal from 'react-bootstrap/Modal';
import CreateAccountForm from './CreateAccountForm';

//modal that pops up when the create account button is clicked, houses all the necessary funcitons
class CreateAccountModal extends Component {
    constructor(props){
        super(props);
        this.state = {
            username:"",
            password:"",
            cpassword:"",
        };
        this.createAccount = this.createAccount.bind(this);
        this.create_user_api = this.create_user_api.bind(this);
        this.handleChange = this.handleChange.bind(this);
        this.handleSubmit=this.handleSubmit.bind(this);
        this.endpoint = "http://localhost:9000";
    }

    //sends info to the server to check the DB
    create_user_api(username, password, cpassword) {
        let data = {
          "username": username,
          "password": password,
          "cpassword": cpassword
        }
    
        fetch(this.endpoint+'/create_account', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify(data)
        })
        .then(res => res.json())
        .then(res => {
            if(res.success){
                this.props.changeUser(res.user); // logs the user in if it was successfull 
            }
            else{
                document.getElementById('error_message_modal').innerHTML=res.message;
            }
        })
      }

    createAccount(username, password, cpassword){
        this.create_user_api(username, password, cpassword);
    }

    handleChange(event, name) {
        this.setState({ [name] : event.target.value});
    }

    handleSubmit(event){
        event.preventDefault();
        

        this.createAccount(this.state.username, this.state.password, this.state.cpassword);
    }

    render() {
        return (
            <Container>
                    <Modal
                        show={this.props.show}
                        size="md"
                        aria-labelledby="contained-modal-title-vcenter"
                        centered
                        onHide = {this.props.onHide}
                    >
                            <Modal.Header closeButton>
                                <Modal.Title id="contained-modal-title-vcenter">
                                    Create an Account
                                </Modal.Title>
                            </Modal.Header>
                            <Modal.Body>
                                <CreateAccountForm 
                                handleChange = {this.handleChange}
                                />
                            </Modal.Body>
                            <Modal.Footer>
                                <p id='error_message_modal'></p>
                                <Button onClick={this.props.onHide}>Close</Button>
                                <Button type="submit" onClick={this.handleSubmit}>Submit</Button>
                            </Modal.Footer>
                    </Modal>
            </Container>
        );
    }
}

export default CreateAccountModal;