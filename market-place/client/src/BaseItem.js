import React, {Component} from 'react'
import Container from 'react-bootstrap/Container';
import Card from 'react-bootstrap/Card';
import Media from 'react-bootstrap/Media';
import Row from 'react-bootstrap/Row';
import Button from 'react-bootstrap/Button';
import placeholder from './stock-images/placeholder.png';
import './ItemForSale.css';

//this is the base item for a person selling something
class BaseItem extends Component {
    constructor(props){
        super(props);
        this.state = {
            currentUser: this.props.user,
            item: this.props.item
        };
    }

    //if there is an image render it, otherwise use the placeholder
    image() {
        if(!this.props.item.img){
            return placeholder;
        }
        else{
            return this.props.item.img;
        }
    }
    render(){
        return (
            <Container className='p-3 item' >
                <Media onClick={()=> {this.props.changeView(this.props.item)}}>
                    {/* image for the item */}
                    <img
                        className="align-self-center mr-3 feed-image"
                        src={this.image()}
                        alt="image of item"
                    />

                    {/* information about the item */}
                    <Media.Body>
                        <h3 className="m-0">{this.props.item.item}</h3>
                        
                        <Row className="px-3 pt-0">
                            <p className="price">Price: {this.props.item.price}

                            {this.props.item.bid && 
                            <>
                            - {this.props.item.bidder}
                            </>
                            }
                            </p> 

                        </Row>
                        <p className="description">{this.props.item.des}</p>
                    </Media.Body>
                </Media>

                {/* neccesary buttons, remove, edit, and how many people are interested */}
                <Row className="px-3">
                    <Button variant="danger" onClick={()=> {this.props.deleteItem(this.props.item)}}>Remove Listing</Button>
                    <div className="px-2">
                        <Button variant="warning" onClick={()=>this.props.edit(this.props.item)}>Edit Item</Button>
                    </div>
                    <div className="pr-2">
                        {this.props.item.interested_users.length} users have displayed interest in this item
                    </div>
                </Row>
            </Container>
        )
    }

}

export default BaseItem;