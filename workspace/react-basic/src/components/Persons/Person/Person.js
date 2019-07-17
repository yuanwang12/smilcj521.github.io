import React from 'react'
import './Person.css'

const Person = props => {
  const style = {
    color: 'red'
  }
  return (
    <div className="personWrapp">
      <h3>我的名字是：<span style={style}>{props.name}</span> ，我的年龄是<span style={style}>{props.age}</span><button onClick={props.deleteThisObj}>删除</button></h3>
      <input type="text" defaultValue={props.name} onChange={props.changepersonInfo} />
    </div>
  )
}

export default Person;