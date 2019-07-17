import React from 'react'
import Person from './Person/Person'

const Persons = (props) => {
  let persons = props.state.persons;
  if (props.state.personState) {
    return (
      persons.map(personObj => {
        console.log(personObj)
        return <Person
          key={personObj.id}
          deleteThisObj={() => props.deletePerson(personObj.id)}
          changepersonInfo={event => props.changeVal(event, personObj.id)}
          name={personObj.name}
          age={personObj.age} />
      })
    )
  } else {
    return (
      <h3>暂无数据</h3>
    )
  }

}

export default Persons;