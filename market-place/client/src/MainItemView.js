import React, {Component} from 'react'
import Container from 'react-bootstrap/Container';
import Card from 'react-bootstrap/Card';
import ListGroup from 'react-bootstrap/ListGroup';
import Media from 'react-bootstrap/Media';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import socketIOClient from 'socket.io-client'
import Button from 'react-bootstrap/Button';
import placeholder from './stock-images/placeholder.png';
import './MainItemView.css';
import ChatBox from './ChatBox.js'
import Form from 'react-bootstrap/Form';



//the main page for an item, when clicked
class MainItemView extends Component {
    constructor(props){
        super(props);
        this.state = {
            currentUser: this.props.currentUser,
            item: this.props.item,
            cbid: this.props.item.price,
            guest: this.props.guest,
            placebid:"",
            showChat:false,
            dm:"",
            bidder:this.props.item.bidder
        };
        this.endpoint = "http://localhost:9000";
        this.sock = socketIOClient(this.endpoint);

        this.handleChangeBid = this.handleChangeBid.bind(this);
        this.submitBid = this.submitBid.bind(this);
        this.updateBid = this.updateBid.bind(this);
        this.checkInterest = this.checkInterest.bind(this);
        this.showChat = this.showChat.bind(this);
    }

    //makes sure all values are set when mounted
    componentDidMount(){
        this.setState({
            item: this.props.item
        })
        this.showPrice = this.showPrice.bind(this);
        this.showSubmitBid = this.showSubmitBid.bind(this);
    }
    image() {
        if(!this.props.item.img){
            return placeholder;
        }
        else{
            return this.props.item.img;
        }
    }

    //handles the bidding
    handleChangeBid(event){
        this.setState({
            placebid: event.target.value
        })
    }
    submitBid(event){
        event.preventDefault();
        if(!isNaN(this.state.placebid) && this.state.placebid > this.props.item.price){
            this.updateBid(this.state.placebid); 
        }
    }

    //makes sure the person who is displaying interest didn't already
    checkInterest(){
        let value=false;
        this.state.item.interested_users.forEach(function(user, index) {
            if(user.name == this.props.currentUser.name){
                value=true;
            }
        }.bind(this));
        return value;
    }

    //sends info to the server for displaying interest
    displayInterest(){

        let data = {
            userid:this.props.currentUser._id,
            username:this.props.currentUser.name,
            itemid:this.props.item._id
        }
  
      fetch(this.endpoint + '/displayInterest', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(data)
      })
      .then(res => res.json())
      .then(res => {
          if(res.success){
            this.sock.emit("updateFeed");
            this.setState({
                item: res.updated_item
            })
        
        }
          else{
            alert('failed')
          }
      })
    }

    //sends new bid information to the server
    updateBid(newb){
        let data = {
            "newbid": newb,
            "id": this.state.item._id,
            "bidder": this.props.currentUser.name      
          }
      
          fetch(this.endpoint + '/updateBid', {
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
                      cbid: res.list,
                      placebid: "",
                      bidder: this.props.currentUser.name
                  })

                  this.sock.emit("updateFeed");

              }
              else{
                  alert("Error");
              }
          })
    }

    //shows either the bid value or the set price
    showPrice(){
        if(this.props.item.bid){
            return(
                <>
                <p className="price">Current Bid: {this.state.cbid} - {this.state.bidder}</p> 
                {this.props.currentUser.name == this.props.item.owner &&
                    <Button variant="success" className="float-right" onClick={()=> {this.props.sellTo(this.state.item, this.state.item.bidder)}}>Sell to {this.state.item.bidder}</Button>
                }
                </>
            )
        }
        else {
            return(
                <p className="price">Price: {this.state.item.price}</p>
            )
        }
    }

    //submit bid form if its bidding not price
    showSubmitBid(){
        if(this.props.item.bid && !this.props.guest){
            return(
                <Form onSubmit={this.submitBid}>
                <Form.Group className="ifield" as={Row}>
                    <Form.Label className="p-1" column sm="4">
                        Place Bid
                    </Form.Label>
                    <Col sm="8" >
                        <Form.Control type='text' id='placebid' value={this.state.placebid} onChange={this.handleChangeBid}required />
                    </Col>
                </Form.Group>
                <Row className="justify-content-center pb-1">
                    <Button type="submit">Submit</Button>
                </Row>
            </Form> 
            )
        }
    }

    //shows the chat box if "DM" is hit
    showChat(name){
        //same user, so close the chat box
        if(name == this.state.dm){
            this.setState({
                showChat: !this.state.showChat,
                dm:""
            })
        }
        else{
            this.setState({
                showChat:!this.state.showChat,
                dm:name
            })
        }
    }

    render(){
        //if its not a guest, and this item is owned by the person viewing. show all interested parties and display the correct buttons
        if(!this.guest && ( this.props.currentUser.name == this.props.item.owner )){
            let interestUsers = this.state.item.interested_users.map((item) => 
            
                <ListGroup.Item key={item.id}>
                    {item.name}
                    <Button variant="success" className="float-right" onClick={()=> {this.props.sellTo(this.props.item, item.name)}}>SOLD</Button>
                    <Button variant="primary" className="float-right" onClick={()=> {this.showChat(item.name)}}>DM</Button>
                </ListGroup.Item>
            )

            return (
                <Container className='p-3'>
                    <Button variant="dark" onClick={()=>{this.props.changeView(null)}}>Return to Shopping</Button>
                    <Media>
                        <img
                            className="main-image float-left pr-3 pt-3 pb-3"
                            src={this.image()}
                            alt="image of item"
                        />
                        <Media.Body>
                            <h3 className="m-0">{this.props.item.item}</h3>
                            
                            <Row className="px-3 pt-0">
                                <span className="main-seller px-3">Seller: {this.props.item.owner}</span>
                                {this.showPrice()}
                            </Row>
                            
                            <p className="main-description">{this.props.item.des}</p>
                        </Media.Body>
                    </Media>
                   
                        <Row className="px-3">
                            <div className="pr-2">
                                <Button size='sm' variant="danger" onClick={()=> {this.props.deleteItem(this.props.item)}}> Remove Listing </Button>
                            </div>
                            <Button size="sm" variant="warning" className="float-right" onClick={()=> this.props.edit(this.props.item)}> Edit </Button>
                        </Row>
                        <Row className="px-3">
                            <div className="interest">
                                <p>{this.props.item.interested_users.length} Users have displayed interest in your item</p>
                            </div>
                        </Row>
                        <Card>
                            <ListGroup>
                                {interestUsers}
                            </ListGroup>
                        </Card>
                        {this.state.showChat &&
                            <ChatBox 
                                currentUser={this.props.currentUser}
                                owner={this.state.dm}
                                
                            />
                        }
                    
                </Container>
            )
        }

        //otherwise someone is trying to buy the item, display the chat and the buy buttons
        return (
           
                <Container className='p-3'>
                    <Button variant="dark" onClick={()=>{this.props.changeView(null)}}>Return to Shopping</Button>
                    <Media>
                        <img
                            className="main-image float-left pr-3 pt-3 pb-3"
                            src={this.image()}
                            alt="image of item"
                        />
                        <Media.Body>
                            <h3 className="m-0">{this.props.item.item}</h3>
                            
                            <Row className="px-3 pt-0">
                                <span className="main-seller px-3">Seller: {this.state.item.owner}</span>
                                {this.showPrice()}
                                {this.showSubmitBid()}
                            </Row>
                            
                            <p className="main-description">{this.props.item.des}</p>
                        </Media.Body>

                    </Media>

                    {/* only show chat and buttons if its not a guest */}
                    {!this.state.guest  && 
                    <>
                        <Row className="px-3">
                            <div className="pr-2">
                                <Button size='sm' variant="success" onClick={()=> {this.props.buy(this.props.item)}}> Buy Now </Button>
                            </div>
                            <Button size="sm" variant="warning" className="float-right" disabled={this.checkInterest()} onClick={()=> {this.displayInterest()}}> Display Interest </Button>
                        </Row>

                        <ChatBox 
                            owner={this.props.item.owner}
                            currentUser={this.props.currentUser}
                        />
                    </>
                    }
                    
                </Container>
            
        )
    }

}

export default MainItemView;