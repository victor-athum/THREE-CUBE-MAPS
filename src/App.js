import React, { Component } from "react";
import MultipleCubeMaps from "./classes/MultipleCubeMaps";
import "./App.css";

class App extends Component {
  constructor() {
    super();
    this.container = null;
  }
  componentDidMount() {
    const cube = new MultipleCubeMaps(this.container);
    cube.init();
    cube.animate();
  }

  render() {
    return (
      <div
        className="App"
        ref={(ref) => {
          this.container = ref;
        }}
      />
    );
  }
}

export default App;
