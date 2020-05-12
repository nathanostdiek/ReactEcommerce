import React, {Component} from 'react';
import NavBar from './NavBar.js';
import ItemforSale from './ItemforSale.js';
import Container from 'react-bootstrap/Container'
import Feed from './Feed.js';
import MainItemView from './MainItemView.js';
import AccountProfile from './AccountProfile.js';
import AddItem from './AddItem.js';
import socketIOClient from 'socket.io-client';
import EditItem from './EditItem.js';
import Button from 'react-bootstrap/Button';


//post login layout
class MainPage extends Component {
    constructor(props){
        super(props);
        this.state = {
            currentUser: this.props.currentUser,
            itemDisplay: false,
            mainItemView: null,
            accountView: false,
            edit:false,
            guest: this.props.guest,
            user_sold:[],
            user_selling:[],
            user_bought:[],
            itemList:[],
            s: this.props.sock
            
        };
        this.endpoint = "http://localhost:9000";
        this.sock = socketIOClient(this.endpoint);
        this.changeView = this.changeView.bind(this);
        this.viewAccount = this.viewAccount.bind(this);
        this.buyItem = this.buyItem.bind(this);
        // this.getSold=this.getSold.bind(this);
        // this.getSelling=this.getSelling.bind(this);
        // this.getBought=this.getBought.bind(this);
        this.getItems=this.getItems.bind(this);
        this.updateItems=this.updateItems.bind(this);
        this.deleteItems=this.deleteItems.bind(this);
        this.edit = this.edit.bind(this);
        this.sellTo=this.sellTo.bind(this);
    }

    //updates items when needed
    updateItems(item){
        
        if(this.state.itemDisplay){
            this.changeView(null);
        }
        this.getItems();
    }

    componentDidMount(){
        this.getItems();
        if(!this.state.guest){
            this.getSold();
            this.getSelling();
            this.getBought();
        }  
    }

    //changes view to and from the main item view
    changeView(item){
            this.setState({
                itemDisplay: !this.state.itemDisplay,
                mainItemView: item
            })
    }

    //view the account when clicked
    viewAccount(){
        this.setState({
            accountView: !this.state.accountView
        });
    }

    //opens the edit form
    edit(item){
        this.setState({
            edit: !this.state.edit,
            itemToEdit: item
        })
    }


    //sends buying info to the server
    buyItem(item){
        let data={
            itemId:item._id,
            buyer: this.state.currentUser
        }
        fetch(this.endpoint+'/buyItem', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(data)
        })
        .then(res => res.json())
        .then( res => {
            //this.changeView(null);
            this.sock.emit("updateFeed");
            this.updateItems(null);
        })
    }

    //sells to a designated person
    sellTo(item, buyer){
        let data={
            itemId:item._id,
            buyer: buyer
        }
        fetch(this.endpoint+'/sellItem', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(data)
        })
        .then(res => res.json())
        .then( res => {
            this.sock.emit("updateFeed");
            this.changeView(null);
            this.updateItems(null);
        })
    }



    //deletes the item and sends it to the serevr
    deleteItems(item){
        let data = {
            itemid: item._id
        }
        fetch(this.endpoint + "/deleteItem", {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body:JSON.stringify(data)
        })
        .then(res => res.json())
        .then(res => {
            if(res.success){
                this.getItems();
                this.sock.emit("updateFeed");
                if(this.state.itemDisplay){
                    this.changeView(null);
                }
            }
            else{
                alert("didn't delete")
            }
        })

    }

    //gets all current items
    getItems(){
        fetch('http://localhost:9000/getItems', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            })
            .then(res => res.json())
            .then(res => {
                if(res.success){
                    this.setState({ itemList: res.list });
                }
                else{
                    alert(res.error);
                }
            })
     };

     componentDidMount(){
        var that = this;
        this.sock.on("additem-toclient",function(data){
            that.setState({
                itemList: data.items
            })
         }); 
         this.sock.on("someoneinterest", function(data){
            alert("HEY. someone liked your item, go look at it and DM them if you want to.");
         })
         this.getItems();
         this.forceUpdate();
     }

     

    render(){
        
        //main item view
        if(this.state.itemDisplay){
            return(
                <Container>
                    <NavBar 
                        currentUser={this.props.currentUser} 
                        logout={this.props.logout}
                        guest={this.state.guest}
                        viewAccount = {this.viewAccount}
                        updateItems={this.updateItems}
                    />

                    {/* if the item is being edited */}
                    {this.state.edit && 
                        <EditItem 
                            display={this.state.edit}
                            item={this.state.itemToEdit}
                            currentUser={this.props.currentUser}
                            updateItems={this.updateItems}
                            edit={this.edit}

                        />
                    }
                    
                    <MainItemView 
                        item = {this.state.mainItemView}
                        currentUser={this.props.currentUser}
                        changeView={this.changeView}
                        guest={this.state.guest}
                        deleteItem={this.deleteItems}
                        edit={this.edit}
                        buy={this.buyItem}
                        sellTo={this.sellTo}

                    />
                </Container>
            );
        }

        //account view
        else if(this.state.accountView){
            return(
                <Container>
                    <NavBar 
                        currentUser={this.props.currentUser} 
                        logout={this.props.logout}
                        guest={this.state.guest}
                        viewAccount={this.viewAccount}
                        updateItems={this.updateItems}
                    />
                    {this.state.edit && 
                        <EditItem 
                            display={this.state.edit}
                            item={this.state.itemToEdit}
                            currentUser={this.props.currentUser}
                            updateItems={this.updateItems}
                            edit={this.edit}

                        />
                    }
                    
                    <AccountProfile 
                        currentUser={this.props.currentUser}
                        viewAccount={this.viewAccount}
                        // sold={this.state.user_sold}
                        // selling={this.state.user_selling}
                        // bought={this.getBought()}
                        deleteItem={this.deleteItems}
                        edit={this.edit}
                        changeView={this.changeView}

                    />
                </Container>  
            );
        }
        else {
            //otherwise show the normal feed
            return (
                <Container>
                    <NavBar 
                        currentUser={this.props.currentUser} 
                        logout={this.props.logout}
                        guest={this.state.guest}
                        viewAccount={this.viewAccount}
                        updateItems={this.updateItems}
                    />
                    <Button variant="dark" onClick={this.getItems}>REFRESH</Button>

                    {this.state.edit && 
                        <EditItem 
                            display={this.state.edit}
                            item={this.state.itemToEdit}
                            currentUser={this.props.currentUser}
                            updateItems={this.updateItems}
                            edit={this.edit}
                            itemList={this.state.itemList}

                        />
                    }
                    <Feed 
                        currentUser={this.props.currentUser}
                        changeView={this.changeView}
                        guest={this.state.guest}
                        buyItem={this.buyItem}
                        itemList={this.state.itemList}
                        deleteItem={this.deleteItems}
                        edit={this.edit}
                        updateItems={this.updateItems}

                    />
                </Container>
            );
        }
    }

}

export default MainPage;