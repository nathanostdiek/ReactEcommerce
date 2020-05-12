import React, {Component} from 'react'
import Container from 'react-bootstrap/Container';
import './MainItemView.css';
import './ChatBox.css';
import './Message.css';

//simple component for one message
class Message extends Component {
    constructor(props){
        super(props);
        
    }

    render(){
        return (
            <Container className={'message-block ' + this.props.ME}>

                <p className="message-from mb-0">{this.props.from}</p>
                <p className="mt-0 message-content">{this.props.content}</p>
                
            </Container>
        )
    }

}

export default Message;