import React, {Component} from 'react'
import Container from 'react-bootstrap/Container';
import Card from 'react-bootstrap/Card';
import Media from 'react-bootstrap/Media';
import Row from 'react-bootstrap/Row';
import Button from 'react-bootstrap/Button';
import './MainItemView.css';
import './ChatBox.css';
import Message from './Message.js';
import Col from 'react-bootstrap/Col';
import Form from 'react-bootstrap/Form';
import socketIOClient from 'socket.io-client'

//this is the main display for a chat box. taken mostly from mod6 and refractored for react
class ChatBox extends Component {
    constructor(props){
        super(props);
        this.state = {
            currentUser: this.props.currentUser,
            reciever: this.props.owner,
            prev_messages: [],
            temp: [],
            message: ""
        };
        this.endpoint = "http://localhost:9000";
        this.a = socketIOClient(this.endpoint);
        this.getMessages = this.getMessages.bind(this);
        this.rMessage = this.rMessage.bind(this);
        this.handleChangeMes = this.handleChangeMes.bind(this);
        this.handleSubmit = this.handleSubmit.bind(this);
        this.sendMessage = this.sendMessage.bind(this);
        this.getMessages = this.getMessages.bind(this);
    }

    //get messages from DB for each user
    getMessages(){
        let data = {
            "from": this.props.currentUser.name,
            "to": this.props.owner,
        }
        fetch("http://localhost:9000/getMessages", {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(data)
        }).then(res => res.json())
        .then(res => {
            if(res.success){
                
                this.setState({ prev_messages: res.message });
            }
            else{
                alert(res.error);
            }
        })

    }

    //update messages with socket
    rMessage(){
        this.a.on("dms-back", function(data){
            
            this.setState({
                prev_messages: data
            });
        })
    }

    //handle the change in the message box
    handleChangeMes(event){
        this.setState({message: event.target.value})

    }
    componentDidMount(){
        this.getMessages();
    }

    //sends the message on submit
    handleSubmit(event){
        event.preventDefault();
        this.sendMessage(this.state.message);
        document.getElementById("message").value = "";    

    }

    //send messages to DB to store
    sendMessage(m){
        let data = {
            "from": this.props.currentUser.name,
            "to": this.props.owner,
            "mes": m,          
          }
      
          fetch(this.endpoint + '/sendMessage', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json'
            },
            body: JSON.stringify(data)
          })
          .then(res => res.json())
          .then(res => {
              if(res.success){
                  this.setState({
                    prev_messages: this.state.prev_messages.concat(res.message)
                  })
                
              }
              else{
                  alert("Error");
              }
          })
    }

    render(){

        //creates the list of components out of the messages from the DB
        let messages = this.state.prev_messages.map((message) =>
            <Message 
                to={message.to}
                from={message.from}
                content={message.mes}
                timestamp={message.timestamp}
                ME={ message.from==this.state.currentUser.name ? "ME" : " "}
                key={message._id}

            />
        );
        return (
                <Row className='pr-3 pt-3'>
                    <Col sm={8 } md={6}>
                        <Card>
                            <Card.Header>
                                Message {this.state.reciever}
                            </Card.Header>
                            <Card.Body className="chat-body">
                                {messages}
                            </Card.Body>
                            <Card.Footer>
                                <Form onSubmit={this.handleSubmit}>
                                    <Form.Group as={Row}>
                                        <Button type="submit" variant="primary">Send</Button>
                                        <Col xs={7} sm={9}>
                                            <Form.Control type="text" onChange={this.handleChangeMes}id="message"placeholder="message..."/>
                                        </Col>
                                    </Form.Group>
                                </Form>
                            </Card.Footer>
                        </Card>
                    </Col>
                </Row>
        )
    }

}

export default ChatBox;