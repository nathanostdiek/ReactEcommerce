import React, {Component} from 'react'
import NavBar from './NavBar.js';
import ItemforSale from './ItemforSale.js';
import Container from 'react-bootstrap/Container';
import BaseItem from './BaseItem.js';
import SoldItem from './SoldItem.js';
import ChatBox from './ChatBox.js';
import Button from 'react-bootstrap/Button';
import BoughtItem from './BoughtItem.js';

class AccountProfile extends Component {
    // view for the user who clicks the "account" button 
    constructor(props){
        super(props);
        this.state = {
            currentUser: this.props.currentUser,
            selling: [],
            sold:  [],
            bought: [],
            uniqueMes:[],
            messages: null
        };
        this.endpoint = "http://localhost:9000";
        this.getBought = this.getBought.bind(this);
        this.getSelling = this.getSelling.bind(this);
        this.getSold = this.getSold.bind(this);
        this.getMessangers = this.getMessangers.bind(this);
   }
   componentDidMount(){
       //grabs each section of items from the api once mounted
    this.getSold();
    this.getSelling();
    this.getBought();
    this.getMessangers();
   }

   //gets all items the user sold
   getSold(){
    let data = {
        ownerid:this.state.currentUser._id
      }
  
      fetch(this.endpoint + '/getSold', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(data)
      })
      .then(res => res.json())
      .then(res => {
         
        if(res.success){
            if(!res.none){
                //sets the state if a success
                this.setState({
                    sold: res.sold_items
                })
            }
        }
          else{
            alert("error with mongo in sold")
          }
      })
}

//gets all the items the user is currently selling
getSelling(){
    let data = {
        ownerid:this.state.currentUser._id
      }
  
      fetch(this.endpoint + '/getSelling', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(data)
      })
      .then(res => res.json())
      .then(res => {
          
          if(res.success){
            if(!res.none){
                //sets the state if it works
                this.setState({
                    selling: res.selling_items
                })
            }
        }
          else{
            alert("error with mongo in selling")
          }
      })
}

//gets all the items teh user bought from other people
getBought(){
        let data = {
        userid:this.state.currentUser._id,
        username:this.props.currentUser.name
      }
      
        fetch(this.endpoint + '/getBought', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json'
            },
            body: JSON.stringify(data)
          })
          .then(res => res.json())
          .then(res => {
              
              if(res.success){
                if(!res.none){
                    //sets the state if it worked
                    this.setState({
                        bought: res.bought_items
                    })
                }
                }
              else{
                alert('sometihng went wrong with mongo in bought')
              }
          })
}

    //gets all the unique users that the user has messenged before
    getMessangers(){
        let data = {
            "name": this.props.currentUser.name,
        }
        fetch("http://localhost:9000/getUniqueMessangers", {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(data)
        }).then(res => res.json())
        .then(res => {
            
            if(res.success){
                //sets state if it worked
                this.setState({
                    uniqueMes: res.distinct
                })
            }
            else{
                alert(res.error);
            }
        })
    }


    render(){
        //creates the components for the currently selling objects
        let selling = this.state.selling.map((item) => 
            <BaseItem 
                currentUser={this.props.currentUser}
                item={item}
                deleteItem={this.props.deleteItem}
                edit={this.props.edit}
                changeView={this.props.changeView}
                key={item._id}

            />
        )
        //creates the components for the sold objects

        let sold = this.state.sold.map((item) => 
            <SoldItem 
                currentUser={this.props.currentUser}
                item={item}
                changeView={this.props.changeView}
                key={item._id}

            />
        )
        //creates the components for the bought objects

        let bought = this.state.bought.map((item) => 
            <BoughtItem 
                currentUser={this.props.currentUser}
                item={item}
                changeView={this.props.changeView}
                key={item._id}

            />
        )

        //creates the chat boxes for each user they have talked to
        let chats = this.state.uniqueMes.map((user) =>
            <ChatBox 
                currentUser={this.props.currentUser}
                owner={user}
                key={user}

            />
        )
    
        return (
            // displays all the different components with the necessary headers
            <Container>
                <Button variant="dark" onClick={()=>{this.props.viewAccount()}}>Return to Shopping</Button>
                <h2>Items You're Selling:</h2>
                <Container>
                    {selling}
                </Container>

                <h2>Items You've Sold:</h2>
                <Container>
                    {sold}
                </Container>

                <h2>Items You've Bought:</h2>
                <Container>
                    {bought}
                </Container>

                <h2>Your Messages:</h2>
                <Container>
                    {chats}
                </Container>
            </Container>
        );
    }

}

export default AccountProfile;