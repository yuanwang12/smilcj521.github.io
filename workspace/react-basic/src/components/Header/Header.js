import React from 'react';
import './Header.css'

const Header = props => {
  let title = props.title;

  let classes = [];
  let personLength = props.state.persons.length;
  if (personLength === 2) {
    classes.push("red");
  }
  if (personLength === 1) {
    classes.push("red");
    classes.push("blod");
  }
  if (personLength === 3) {
    classes = [];
  }

  if (props.state.personState) {
    props.headerStyle.backgroundColor = 'red'
  }
  return (
    <div>
      <h3 className={classes.join(" ")}>{title}</h3>
      <button
        style={props.headerStyle}
        onClick={props.toggleState}>切换状态</button>
    </div>
  )
}

export default Header;