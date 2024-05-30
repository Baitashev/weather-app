import logo from './logo.svg';
import './App.css';
import WeekContainer from "./WeekContainer";
import {Component} from "react";

class App extends Component {
  render(){
    return(
        <div className="App">
          <WeekContainer />
        </div>
    )
  }
}
class WeatherDisplay extends Component {
    render() {
        return (
            <h1>Displaying some Weather!</h1>
        );
    }
}
export default App;
