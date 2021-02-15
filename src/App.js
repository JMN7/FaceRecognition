import React, { Component } from 'react';
import Navigation from './components/Navigation/Navigation';
import Clarifai from 'clarifai';
import Logo from './components/Logo/Logo';
import Signin from './components/Signin/Signin';
import Register from './components/Register/Register';
import FaceRecognition from './components/FaceRecognition/FaceRecognition';
import ImageLinkForm from './components/ImageLinkForm/ImageLinkForm';
import Rank from './components/Rank/Rank';
import Particles from 'react-particles-js';
import './App.css';

const app = new Clarifai.App({ apiKey: 'e782523fc29745c9b5f2f892f808080d' });

const particlesOptions = {
  particles: {
    number: {
      value: 150,
      density: {
        enable: true,
        value_area: 800
      }
    }
  }
};


class App extends Component {

  constructor(){

    super();
    this.state = {
      input: '',
      imageURL: '',
      box: {},
      route: 'signin',
      isSignedIn: false,
      user: {
      id: '',
      name: '',
      email: '',
      entries: 0,
      joined: ''
    }
   } 
  }

  loadUser = (data) => {

    this.setState({user: {
      id: data.id,
      name: data.name,
      email: data.email,
      entries: data.entries,
      joined: data.joined
    }});

  }

  onInputChange = (event) => {

      console.log(event.target.value);
      this.setState({input: event.target.value});

  }

  onButtonSubmit = () => {

      console.log('click ' + this.state.input);

      this.setState({imageURL: this.state.input});

       app.models.predict(Clarifai.FACE_DETECT_MODEL, this.state.input)
        .then(response => {
          console.log(response);
          this.displayFaceBox(this.caculateFaceLocation(response));

        })
        .catch(err => {
          console.log(err);
        });
  }

  caculateFaceLocation = (data) => {

       const clarifaiFace = data.outputs[0].data.regions[0].region_info.bounding_box;
       const image = document.getElementById('imageInput');
       const width = image.width;
       const height = image.height;

       return {

           leftCol: clarifaiFace.left_col * width,
           topRow: clarifaiFace.top_row * height,
           rightCol: width - (clarifaiFace.right_col * width),
           bottomRow: height - (clarifaiFace.bottom_row * height)
       }
  }

  displayFaceBox = (box) => {

    console.log(box);
    this.setState({box: box});
  }

   onRouteChange = (route) => {
    
    if (route === 'signout') {
      this.setState({isSignedIn: false})
    } else if (route === 'home') {
      this.setState({isSignedIn: true})
    }
    this.setState({route: route});
  }

  render(){

  const { isSignedIn, imageUrl, route, box } = this.state;

  return (
    <div className="App">
         <Particles className='particles'
          params={particlesOptions}
        />
        <Navigation isSignedIn={isSignedIn} onRouteChange={this.onRouteChange} />
        { route === 'home'
          ? <div>
              <Logo />
              <Rank
              />
              <ImageLinkForm
                onInputChange={this.onInputChange}
                onButtonSubmit={this.onButtonSubmit}
              />
              <FaceRecognition box={box} imageUrl={imageUrl} />
            </div>
          : (
             route === 'signin'
             ? <Signin onRouteChange={this.onRouteChange}/>
             : <Register onRouteChange={this.onRouteChange}/>
            )
        }
      </div>
  );
 };
}

export default App;
