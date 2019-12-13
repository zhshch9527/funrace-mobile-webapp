import React from 'react';
import {getFunctionValue} from "../../utils/common";

class BaseRender extends React.Component {
  initProps=(props,type)=>{
    if(type === 'init'){
      this.state = {
        ...this.state,
        props,
      }
    }else{
      this.setState({props}) ;
    }
  }

  constructor(props) {
    super(props);
    this.initProps(props,'init') ;
  }

  componentWillReceiveProps(nextProps){
    this.initProps(nextProps) ;
  }

  componentDidUpdate(){
    let {componentDidUpdate} = this.props ;
    componentDidUpdate && componentDidUpdate() ;
  }

  componentDidMount(){
    let {componentDidMount} = this.props ;
    componentDidMount && componentDidMount() ;
  }

  componentWillUnmount(){
    let {componentWillUnmount} = this.props ;
    componentWillUnmount && componentWillUnmount() ;
  }

  flush=(props)=>{
    if(props){
      this.componentWillReceiveProps(props) ;
    }else{
      this.setState({}) ;
    }
  }

  render() {
    let {props} = this.state ;
    let {visible=true,divProps} = props ;
    return visible ? (
      <div {...divProps}>
        {getFunctionValue(this.props.children,props)}
      </div>
    ) : null ;
  }
}


export default BaseRender;
