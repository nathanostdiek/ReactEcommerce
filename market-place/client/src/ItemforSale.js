import React, {Component} from 'react'
import Container from 'react-bootstrap/Container';
import Card from 'react-bootstrap/Card';
import Media from 'react-bootstrap/Media';
import Row from 'react-bootstrap/Row';
import Button from 'react-bootstrap/Button';
import placeholder from './stock-images/placeholder.png';
import './ItemForSale.css';
import socketIOClient from 'socket.io-client';

//base element for a single item being sold
class ItemforSale extends Component {
    constructor(props){
        super(props);
        this.state = {
            currentUser: this.props.currentUser,
            item: this.props.item,
            guest: this.props.guest
        };
        this.endpoint = "http://localhost:9000";
        this.sock = socketIOClient(this.endpoint);
        this.buttons = this.buttons.bind(this);
        this.displayInterest = this.displayInterest.bind(this);
        this.checkInterest = this.checkInterest.bind(this);
        this.showPrice = this.showPrice.bind(this);
    }
    image() {
        if(!this.props.item.img){
            return placeholder;
        }
        else{
            return this.props.item.img;
        }
    }

    //sends info to the server if the display interest button is clicked
    displayInterest(){
        let data = {
            userid:this.state.currentUser._id,
            username:this.state.currentUser.name,
            itemid:this.state.item._id
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
            this.sock.emit("interestup", {dis: this.props.currentUser.name, own: this.state.item.owner})
        }
          else{
            alert("something went wrong with the server")      
        }
      })
    }

    //checks to see if the user has already displayed interest, if so it disables the button
    checkInterest(){
        let value=false;
        this.props.item.interested_users.forEach(function(user, index) {
            if(user.name == this.props.currentUser.name){
                value=true;
            }
        }.bind(this));
        return value;
    }

    //decides what buttons should be rendered based on the guest value
    buttons() {
        if(!this.state.guest){
            
            return(
                <Row className="px-3">
                        <div className="pr-2">
                            <Button size='sm' variant="success" onClick={()=>{this.props.buyItem(this.state.item)}}> Buy Now </Button>
                        </div>
                        <Button size="sm" variant="warning" className="float-right" disabled={this.checkInterest()} onClick={() => {this.displayInterest()}}> Display Interest </Button>
                </Row>
            )
            
        }
        return;
    }

    //price or bid value gets displayed
    showPrice(){

        if(this.props.item.bid){
            return(
            <p className="bid">Current Bid: {this.props.item.price} - {this.props.item.bidder}</p> 
            )
        }
        else {
            return(
            <p className="price">Price: {this.props.item.price}</p> 
            )
        }
    }
    render(){
        
            return (
                <Container className={'p-3 item'} >
                    <Media onClick={()=> {this.props.changeView(this.props.item)}}>
                        <img
                            className="align-self-center mr-3 feed-image"
                            src={this.image()}
                            alt="image of item"
                        />
                        <Media.Body>
                            <h3 className="m-0">{this.props.item.item}</h3>
                            
                            <Row className="px-3 pt-0">
                                <span className="seller px-3">Seller: {this.props.item.owner}</span>
                                {this.showPrice()}
                            </Row>
                            
                            <p className="description">{this.props.item.des}</p>
                        </Media.Body>
                    </Media>
                    {this.buttons()}
                </Container>
            )
        
    }

}

export default ItemforSale;