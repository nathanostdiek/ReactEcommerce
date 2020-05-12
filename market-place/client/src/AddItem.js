import React, {Component} from 'react'
import Container from 'react-bootstrap/Container';
import Navbar from 'react-bootstrap/Navbar';
import Nav from 'react-bootstrap/Nav';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import Form from 'react-bootstrap/Form';
import Button from 'react-bootstrap/Button';
import Feed from './Feed.js';
import './AddItem.css';
import socketIOClient from 'socket.io-client'
import ImageGrid from './ImageGrid.js';

//component that makes up the form for adding an item
class AddItem extends Component {
    constructor(props){
        super(props);
        this.state = {
            currentUser: this.props.currentUser,
            itemList: this.props.itemList,
            constructed: true,
            guest:this.props.guest,
            additem_name: "",
            additem_price: "",
            additem_pic: null,
            additem_des: "",
            additem_bidprice: "",
            display: this.props.form,
            additem_setprice: true,
            additem_setbid: false

        };
        this.endpoint = "http://localhost:9000";
        this.sock = socketIOClient(this.endpoint);
        this.handleChangeName = this.handleChangeName.bind(this);
        this.handleChangePrice = this.handleChangePrice.bind(this);
        this.handleChangeDes = this.handleChangeDes.bind(this);
        this.handleSubmit = this.handleSubmit.bind(this);
        this.additem_api = this.additem_api.bind(this);
        this.handleChangeBidPrice = this.handleChangeBidPrice.bind(this);
        this.chooseImage = this.chooseImage.bind(this);
        this.handleChangeSetPrice = this.handleChangeSetPrice.bind(this);
        this.handleChangeSetBid = this.handleChangeSetBid.bind(this);

    }
    //handles the changes of input fields on form
    handleChangeName(event) {
        this.setState({additem_name: event.target.value})
    }
    handleChangeSetPrice(event) {
        this.setState({additem_setprice: event.target.checked, additem_setbid: false})
    }
    handleChangeSetBid(event) {
        this.setState({additem_setbid: event.target.checked,additem_setprice: false})
    }
    handleChangePrice(event){
        this.setState({additem_price: event.target.value})

    }
    handleChangePic(event){
        this.setState({additem_pic: event.target.files[0]})

    }
    handleChangeDes(event){
        this.setState({additem_des: event.target.value})
    }
    handleChangeBidPrice(event){
        this.setState({additem_bidprice: event.target.value})
    }

    //handles the selection of an image
    chooseImage(src){
        this.setState({additem_pic: src})
    }

    //when form submit get values and send to DB
    handleSubmit(event){
        event.preventDefault();
        if(isNaN(this.state.additem_price)){
            alert("Price is not a number. Try again.");
        }
        else{
            let bid = false;
            if(this.state.additem_setbid){
                bid = true;
            }
            this.additem_api(this.state.additem_name, this.state.additem_price, this.state.additem_des, bid, this.state.additem_pic);
            document.getElementById("additemname").value = "";
            document.getElementById("additemprice").value = "";
            document.getElementById("additemdes").value = "";
            document.getElementById("addform").style.display = "none";
            //resets the state so a new item can be added
            this.setState({
                additem_name: "",
                additem_des: "",
                additem_price: "",
                display: false
            })
        }

    }

    //send item to DB
    additem_api(name, price, des, bid, pic) {
        let data = {
          "name": name,
          "price": price,
          "bid": bid,
          "description": des,
          "img": pic,
          "owner": this.props.currentUser.name,
          "ownerid": this.props.currentUser._id
        
        }
    
        fetch(this.endpoint + '/addItem', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify(data)
        })
        .then(res => res.json())
        .then(res => {
            if(res.success){
                //updates the feed
                this.sock.emit("updateFeed");
            }
            else{
                alert("Error");
            }
        })
      }

    render(){
        //if the form is being shown, render, otherwise dont
        if(this.props.form == true){
            return (
                <Container id="addform">
                    <Form onSubmit={this.handleSubmit}>

                        {/* gets the name of the item */}
                        <Form.Group className="ifield" as={Row}>
                            <Form.Label className="p-1" column sm="4">
                                Item Name
                            </Form.Label>
                            <Col sm="8" >
                                <Form.Control type='text' id='additemname' value={this.state.additem_name} onChange={this.handleChangeName}required />
                            </Col>
                        </Form.Group>

                        {/* gets the value for fixed price or a bid */}
                        <Form.Group className="ifield"  as={Row}>
                            <Form.Label className="p-1" column sm="3">
                                Set Price?
                            </Form.Label>
                            <Col sm="2" >
                                <Form.Control type='radio' id='setprice' name="type" onChange={this.handleChangeSetPrice} required/>
                            </Col>
                            <Form.Label className="p-1" column sm="3">
                                Bid?
                            </Form.Label>
                            <Col sm="2" >
                                <Form.Control type='radio' id='setbid' name="type" onChange={this.handleChangeSetBid} />
                            </Col>
                        </Form.Group>

                        {/* gets the starting bid or the price */}
                        <Form.Group className="ifield"  as={Row}>
                            <Form.Label className="p-1" column sm="4">
                                Price or Starting Bid
                            </Form.Label>
                            <Col sm="8" >
                                <Form.Control type='text' min="1" step="any" id='additemprice' value={this.state.additem_price} onChange={this.handleChangePrice}required />
                            </Col>
                        </Form.Group>


                        {/* image selection, triggered on a click of the image */}
                        <Form.Group className="ifield"  as={Row}>
                            <Form.Label className="p-1" column sm="4">
                                Image
                            </Form.Label>
                            <Col sm="8" >
                                <ImageGrid 
                                    currentUser={this.props.currentUser}
                                    chooseImage={this.chooseImage}
                                />
                            </Col>
                        </Form.Group>

                        {/* gets the description of the item */}
                        <Form.Group className="ifield" as={Row}>
                            <Form.Label className="p-1" column sm="4">
                                Description
                            </Form.Label>
                            <Col sm="8" >
                                <Form.Control as='textarea' id='additemdes' value={this.state.additem_des} onChange={this.handleChangeDes}required />
                            </Col>
                        </Form.Group>

                        {/* submit the form */}
                        <Row className="justify-content-center pb-1">
                            <Button type="submit">Submit</Button>
                        </Row>
                    </Form>
                </Container>
            );
        }
        else{
            return null;
        }
    }

}

export default AddItem;