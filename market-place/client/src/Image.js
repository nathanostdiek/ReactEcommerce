import React, {Component} from 'react'
import './ItemForSale.css';

//class that houses an image with a clicked function for image selection in the add/edit item forms
class Image extends Component{
    constructor(props){
        super(props);
        this.state = {
            class:" ",     
        };
        this.endpoint = "http://localhost:9000";
        this.clicked = this.clicked.bind(this);
    }
    clicked(){
        this.setState({
            class:"selected"
        });
        this.props.chooseImage(this.props.src);
    }
    render() {
        return (
            <img 
                className={"form-image " + this.state.class}
                src={this.props.src}
                onClick={()=> {this.clicked()}}
            />
        )
    }
}
export default Image;