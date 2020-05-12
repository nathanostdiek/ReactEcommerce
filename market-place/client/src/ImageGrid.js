import React, {Component} from 'react'
import Container from 'react-bootstrap/Container';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import placeholder from './stock-images/placeholder.png';
import sofa from './stock-images/sofa.jpg';
import chair from './stock-images/chair.jpg';
import bed from './stock-images/bed.png';
import bigchair from './stock-images/bigchair.jpg';
import table from './stock-images/table.png';
import TV from './stock-images/TV.png';
import kitchen from './stock-images/kitchen.jpg';
import dresser from './stock-images/dresser.jpg';
import './ItemForSale.css';
import Image from './Image.js'


//shows all the images in a nicely formatted grid
class ImageGrid extends Component {
    constructor(props){
        super(props);
        this.state = {
            currentUser: this.props.currentUser,
            
        };
        this.endpoint = "http://localhost:9000";
        
    }
    
    render(){
        
        
            return (
                <Container className="image-choice">
                    <Row>
                        <Col>
                            <Image src={sofa} className="form-image" chooseImage={this.props.chooseImage}/>
                        </Col>
                            
                        <Col>
                            <Image src={chair} className="form-image" chooseImage={this.props.chooseImage}/>
                        </Col>

                        <Col>
                            <Image src={bed} className="form-image" chooseImage={this.props.chooseImage}/>
                        </Col>
                    </Row>

                    <Row>
                        <Col>
                            <Image src={bigchair} className="form-image" chooseImage={this.props.chooseImage}/>
                        </Col>
                            
                        <Col>
                            <Image src={table} className="form-image" chooseImage={this.props.chooseImage}/>
                        </Col>

                        <Col>
                            <Image src={TV} className="form-image" chooseImage={this.props.chooseImage}/>
                        </Col>
                    </Row>

                    <Row>
                        <Col>
                            <Image src={kitchen} className="form-image" chooseImage={this.props.chooseImage}/>
                        </Col>
                            
                        <Col>
                            <Image src={dresser} className="form-image" chooseImage={this.props.chooseImage}/>
                        </Col>

                        <Col>
                            <Image src={placeholder} className="form-image" chooseImage={this.props.chooseImage}/>
                        </Col>
                    </Row>
                </Container>
            )
        
    }

}

export default ImageGrid;