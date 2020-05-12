import React, {Component} from 'react'
import Container from 'react-bootstrap/Container';
import Card from 'react-bootstrap/Card';
import Media from 'react-bootstrap/Media';
import Row from 'react-bootstrap/Row';
import Button from 'react-bootstrap/Button';
import placeholder from './stock-images/placeholder.png';
import './ItemForSale.css';

//for the account view, this shows an item that has been bought by the user
class BoughtItem extends Component {
    constructor(props){
        super(props);
        this.state = {
            currentUser: this.props.user,
            item: this.props.item
        };
    }
    image() {
        if(!this.state.item.img){
            return placeholder;
        }
        else{
            return this.state.item.img;
        }
    }
    render(){
        return (
            <Container className='p-3 sold-item' >
                <Media>
                    <img
                        className="align-self-center mr-3 feed-image"
                        src={this.image()}
                        alt="image of item"
                    />
                    <Media.Body>
                        <h3 className="m-0">{this.state.item.item}</h3>
                        
                        <Row className="px-3 pt-0">
                            <p className="price-bought">Bought For: {this.state.item.price}</p> 
                        </Row>
                        <p className="description">{this.state.item.des}</p>
                    </Media.Body>
                </Media>
                <Row className="px-3">
                        <div className="sold-message">
                            <p>You bought this item from: {this.state.item.owner}</p>
                        </div>
                </Row>
            </Container>
        )
    }

}

export default BoughtItem;