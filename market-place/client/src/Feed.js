import React, {Component} from 'react';
import NavBar from './NavBar.js';
import ItemforSale from './ItemforSale.js';
import Container from 'react-bootstrap/Container';
import SoldItem from './SoldItem.js';
import BaseItem from './BaseItem.js';
import socketIOClient from 'socket.io-client'



class Feed extends Component {
    constructor(props){
        super(props);
        this.state = {
            currentUser: this.props.currentUser,
            guest: this.props.guest,
            items: this.props.itemList
        };
        this.endpoint = "http://localhost:9000";
        this.update = this.update.bind(this);
    }

    //this updates the feed when necessary
    update(data){
        this.setState({
            items: data
        })
    }

    render(){

        //creates a component for each item, either one you're selling or one being sold
        let itemComponents = this.props.itemList.map((item) => {
        
            if(!this.state.guest && (item.owner == this.state.currentUser.name) && !item.sold){
              //  console.log("making a fucking base item: " + JSON.stringify(item))
                return <BaseItem 
                    currentUser={this.state.currentUser}
                    item={item}
                    key={item._id}
                    changeView = {this.props.changeView}
                    changeView = {this.props.changeView}
                    deleteItem={this.props.deleteItem}
                    edit={this.props.edit}
                />
            }
            else if(!item.sold){
                return <ItemforSale 
                currentUser={this.state.currentUser}
                item={item}
                key={item._id}
                changeView = {this.props.changeView}
                guest={this.state.guest}
                buyItem={this.props.buyItem}

                 />
            }
        }
        );

        return(
            <Container>  
                {itemComponents}
            </Container>
        );
    }
}

export default Feed;