import React, {Component} from 'react'
import Container from 'react-bootstrap/Container';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import Form from 'react-bootstrap/Form';
import Button from 'react-bootstrap/Button';
import './AddItem.css';
import ImageGrid from './ImageGrid.js';
import socketIOClient from 'socket.io-client'


//edit item form, same as add item, just sends a different request and has different id names
class EditItem extends Component {
    constructor(props){
        super(props);
        this.state = {
            currentUser: this.props.currentUser,
            itemList: this.props.itemList,
            constructed: true,
            guest:this.props.guest,
            edititem_name: "",
            edititem_price: "",
            edititem_pic: null,
            edititem_des: "",
            edititem_bidprice: "",
            display: this.props.form,
            edititem_setprice: true,
            edititem_setbid: false

        };
        this.endpoint = "http://localhost:9000";
        this.sock = socketIOClient(this.endpoint);
        this.handleChangeName = this.handleChangeName.bind(this);
        this.handleChangePrice = this.handleChangePrice.bind(this);
        this.handleChangeDes = this.handleChangeDes.bind(this);
        this.handleSubmit = this.handleSubmit.bind(this);
        this.editItem = this.editItem.bind(this);
        this.handleChangeBidPrice = this.handleChangeBidPrice.bind(this);
        this.chooseImage = this.chooseImage.bind(this);
        this.handleChangeSetPrice = this.handleChangeSetPrice.bind(this);
        this.handleChangeSetBid = this.handleChangeSetBid.bind(this);

    }
    componentDidMount() {
        //initializes state so the items are pre-filled
        this.setState({
            edititem_name: this.props.item.item,
            edititem_price: this.props.item.price,
            edititem_pic: this.props.item.img,
            edititem_des: this.props.item.des,
            edititem_setbid: this.props.item.bid
        })
    }

    //handles all the changes for each field 
    handleChangeName(event) {
        this.setState({edititem_name: event.target.value})
    }
    handleChangeSetPrice(event) {
        this.setState({edititem_setprice: event.target.checked, edititem_setbid: false})
    }
    handleChangeSetBid(event) {
        this.setState({edititem_setbid: event.target.checked,edititem_setprice: false})
    }
    handleChangePrice(event){
        this.setState({edititem_price: event.target.value})

    }
    handleChangePic(event){
        this.setState({edititem_pic: event.target.files[0]})

    }
    handleChangeDes(event){
        this.setState({edititem_des: event.target.value})
    }
    handleChangeBidPrice(event){
        this.setState({edititem_bidprice: event.target.value})
    }

    chooseImage(src){
        this.setState({edititem_pic: src})
    }
    
    //on submit the values are pulled and it calls the api function
    handleSubmit(event){
        event.preventDefault();
        if(isNaN(this.state.edititem_price)){
            alert("Price is not a number. Try again.");
        }
        else{
            let bid = false;
            if(this.state.edititem_setbid){
                bid = true;
            }
            this.editItem(this.state.edititem_name, this.state.edititem_price, this.state.edititem_des, bid, this.state.edititem_pic);
            document.getElementById("edititemname").value = "";
            document.getElementById("edititemprice").value = "";
            document.getElementById("edititemdes").value = "";
            document.getElementById("editform").style.display = "none";
            this.setState({
                edititem_name: "",
                edititem_des: "",
                edititem_price: "",
                display: false
            })
        }

    }

    //sends info to the database
    editItem(name, price, des, bid, pic) {
        let data = {
        "itemid":this.props.item._id,
          "name": name,
          "price": price,
          "description": des,
          "img": pic,
          "bid":bid,
          "owner": this.props.currentUser.name,
          "ownerid": this.props.currentUser._id,
          "interest": this.props.item.interest,
          "interested_users":this.props.item.interested_users
        }
    
        fetch(this.endpoint + '/EditItem', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify(data)
        })
        .then(res => res.json())
        .then(res => {
            if(res.success){
                this.props.updateItems(res);
                this.sock.emit("updateFeed");
                this.props.edit(null);
            }
            else{
                alert("Error");
                this.sock.emit("updateFeed");
            }
        })
      }

    render(){
        if(this.props.display == true){
            return (
                <Container id="editform">
                    <Form onSubmit={this.handleSubmit}>

                        {/* item name */}
                        <Form.Group className="ifield" as={Row}>
                            <Form.Label className="p-1" column sm="4">
                                Item Name
                            </Form.Label>
                            <Col sm="8" >
                                <Form.Control type='text' id='edititemname' value={this.state.edititem_name} onChange={this.handleChangeName}required />
                            </Col>
                        </Form.Group>

                        {/* price or bidding */}
                        <Form.Group className="ifield"  as={Row}>
                            <Form.Label className="p-1" column sm="3">
                                Set Price?
                            </Form.Label>
                            <Col sm="2" >
                                <Form.Control type='radio' id='setprice_edit' checked={!this.state.edititem_setbid} name="type" onChange={this.handleChangeSetPrice} required/>
                            </Col>
                            <Form.Label className="p-1" column sm="3">
                                Bid?
                            </Form.Label>
                            <Col sm="2" >
                                <Form.Control type='radio' id='setbid_edit' name="type" checked={this.state.edititem_setbid} onChange={this.handleChangeSetBid} />
                            </Col>
                        </Form.Group>

                        {/* starting value for price or bid */}
                        <Form.Group className="ifield"  as={Row}>
                            <Form.Label className="p-1" column sm="4">
                                Price or Starting Bid
                            </Form.Label>
                            <Col sm="8" >
                                <Form.Control type='text' min="1" step="any" id='edititemprice' value={this.state.edititem_price} onChange={this.handleChangePrice}required />
                            </Col>
                        </Form.Group>

                        {/* image selection */}
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

                        {/* descripton */}
                        <Form.Group className="ifield" as={Row}>
                            <Form.Label className="p-1" column sm="4">
                                Description
                            </Form.Label>
                            <Col sm="8" >
                                <Form.Control as='textarea' id='edititemdes' value={this.state.edititem_des} onChange={this.handleChangeDes}required />
                            </Col>
                        </Form.Group>

                        {/* submit */}
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

export default EditItem;