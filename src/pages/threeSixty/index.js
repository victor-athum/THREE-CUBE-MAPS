import { arrayOf, func, shape, string } from 'prop-types';
import React, { Component } from 'react';
import { connect } from 'react-redux';
import CubeMap from '../../classes/ReflectionCubeMaps';
import ThreeSixtyAction from '../../stores/threeSixty/actions';

class ThreeSixty extends Component {
  constructor() {
    super();
    this.container = null;
  }

  async componentDidMount() {
    // get cube faces
    const { dispatch } = this.props;
    const { model } = await dispatch(ThreeSixtyAction.getScenes());

    const cubeMap = new CubeMap(this.container);
    cubeMap.init(model.cube);
    cubeMap.animate();
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

const mapStateToProps = (state) => {
  const {
    currentLevel,
    selectedStyleName,
    selectedScene,
    selectedFinish,
    mode,
    levels,
    cube
  } = state.threeSixty;
  return {
    currentLevel,
    selectedStyleName,
    selectedScene,
    selectedFinish,
    mode,
    levels,
    cube
  };
};

ThreeSixty.propTypes = {
  cube: arrayOf(string).isRequired,
  levels: arrayOf(shape({})).isRequired,
  dispatch: func.isRequired
};

const mapDispatchToProps = (dispatch) => ({
  dispatch
});

export default connect(mapStateToProps, mapDispatchToProps)(ThreeSixty);
