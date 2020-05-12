import React, {Component} from 'react';
import './App.css';
import Welcome from './welcome.js';
import Login from './Login.js';
import MainPage from './MainPage';
import NavBar from './NavBar.js'
import 'bootstrap/dist/css/bootstrap.min.css';
import AccountProfile from './AccountProfile';
import socketIOClient from 'socket.io-client'

class App extends Component {
  constructor(props){
    super(props);

    this.state = {
      loggedIn: false,
      currentUser: null,
      guest: false
    };

    this.endpoint = "http://localhost:9000";
    this.changeUser = this.changeUser.bind(this);
    this.asGuest = this.asGuest.bind(this);
    this.logout = this.logout.bind(this);
  }

  send = () => {
    const socket = socketIOClient(this.endpoint);
    
  }

  //change the user during login and logout
  changeUser(user){
    this.setState({
      currentUser:user,
      loggedIn: true
    })
  }

  logout(){
    
    this.setState({
      currentUser:null,
      loggedIn:false,
      guest: false
    });
  }

  //enters site as a guest
  asGuest(){
    this.setState({
      guest:true,
      currentUser:" ",
      loggedIn:true
    })
  }


  componentDidMount() {
    const socket = socketIOClient(this.endpoint);

  }

  render() {
  const socket = socketIOClient(this.endpoint);

    if(this.state.loggedIn){ //if user is logged in with an account then it displays their account as well as the whole page
      return (
        <div className="container">
          <script src="/socket.io/socket.io.js"></script>
          <MainPage 
            currentUser={this.state.currentUser}
            logout={this.logout}
            guest={this.state.guest}
            sock={socket}
          />
        </div>
      );
    }
    else{
      if(this.state.guest){ // if the user is a guest then only the main page is displayed
        return(
          <div className="container">
            <script src="/socket.io/socket.io.js"></script>
              <MainPage 
                asGuest={this.asGuest} 
                sock={socket}
                  /> 
  
          </div>
          ); 
      }
      else { //if they're neither logged in nor a guest then it just displays the login screen
        return(
          <div className="container">
              <script src="/socket.io/socket.io.js"></script>
              <Login 
                changeUser={this.changeUser}
                asGuest ={this.asGuest}
                sock={socket}

              />
          </div>
          ); 
    }
  }
}
}
export default App;
