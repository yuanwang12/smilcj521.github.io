import React from 'react';
import './App.css';
import Header from '../components/Header/Header'
import Persons from '../components/Persons/Persons'


class App extends React.Component {
  // constructor ES7/8新增创建类时默认执行的方法 主要应用设置状态
  constructor(props) {
    console.log("执行构造函数");
    super();//调用Component父类的构造方法
    this.state = {
      persons: [
        { name: "汪渊1号", age: "18", id: "1" },
        { name: "汪渊2号", age: "20", id: "2" },
        { name: "汪渊3号", age: "22", id: "3" }
      ],
      personState: true
    }
  }

  // 组件即将被渲染 用来修改状态
  componentWillMount () {
    console.log('组件即将被渲染');
  }

  // 组件渲染完成
  componentDidMount () {
    console.log("组件渲染完成");
  }

  // 组件即将更新
  componentWillUpdate () {
    console.log("组件即将更新");
  }

  //组件更新完成
  componentDidUpdate () {
    console.log("组件更新完成");
  }

  // state

  // changeVal
  changeVal = (event, id) => {
    let newName = event.target.value;
    let personIndex = this.state.persons.findIndex(item => {
      return item.id === id
    })
    let personsArr = [...this.state.persons];
    personsArr[personIndex].name = newName;
    this.setState({
      persons: personsArr
    })
  }

  // 切换状态
  toggleState = () => {
    let personState = this.state.personState;
    this.setState({
      personState: !personState
    });
  }

  // 删除当前数据
  deletePerson = (id) => {
    // 通过id查找当前id所在对象
    let personIndex = this.state.persons.findIndex(obj => {
      return obj.id === id;
    })
    let persons = [...this.state.persons];
    persons.splice(personIndex, 1);
    this.setState({
      persons: persons
    })
  }

  render () {
    console.log("这是reander方法，将jsx转化为虚拟dom挂载在根dom上，同时解析jsx为js共浏览器运行");
    let style = {
      border: '1px solid #22222',
      backgroundColor: 'green',
      color: '#fff'
    }

    // 渲染dom
    return (
      <div className="main">
        <Header
          title={this.props.title}
          state={this.state}
          headerStyle={style}
          toggleState={this.toggleState} />
        <Persons
          deletePerson={this.deletePerson}
          changeVal={this.changeVal}
          state={this.state} />
      </div>
    )
  }
}

export default App;
