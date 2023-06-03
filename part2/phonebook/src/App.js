import { useState, useEffect } from 'react'
import axios from 'axios'
import personService from './services/persons'

const Filter = ({searchTerm,handleSearchChange}) => {
  return (
    <div>
    filter shown with <input
      value={searchTerm}
      onChange={handleSearchChange}
    />
  </div>
  )
}

const PersonForm = ({addPerson, newName, handlePersonChange, newPhone, handlePhoneChange}) => {
  return (
    <form onSubmit={addPerson}>
    <InputField name="name" value={newName} onChange={handlePersonChange}/>
    <InputField name="number" value={newPhone} onChange={handlePhoneChange}/>
    <div>
      <button type="submit">add</button>
    </div>
  </form>
  )
}

const InputField = ({name,value,onChange}) => {
  return (
    <div>
    {name}: <input 
    value={value}
    onChange={onChange}
    />
    </div>
  )
}

const Persons = ({personsToShow, deleteEntry}) => {
  return (
    <div>
    {personsToShow.map((person) => (
      <PersonInfo key={person.id} person={person} deleteEntry={() => deleteEntry(person.id, person.name)}/>
    ))}
  </div>
  )
}

const PersonInfo = ({person, deleteEntry}) => {
  return (
    <p key={person.name}>{person.name} {person.number} <button onClick={deleteEntry}>delete</button></p>
  )
}

const App = () => {
  const [persons, setPersons] = useState([])

  useEffect(() => {
    personService
      .getData()
      .then(response => {
        setPersons(response.data)
      })
  }, [])

  const [newName, setNewName] = useState('')
  const [newPhone, setNewPhone] = useState('')
  const [searchTerm, setSearchTerm] = useState('')
  const [showMatch, setShowMatch] = useState(true)

  const personsToShow = showMatch
  ? persons.filter(person => person.name && person.name.toLowerCase().includes(searchTerm.toLowerCase()))
  : persons

  const addPerson = (event) => {
    event.preventDefault()
    const nameExists = persons.some((person) => person.name === newName)
    if (!nameExists) {
      const personObject = { name: newName, number: newPhone }
      setPersons(persons.concat(personObject))
      setNewName('')
      setNewPhone('')

      personService
      .updateData(personObject)
      .then(response => {
        setPersons(persons.concat(response.data))
      })
    }
    else {
      if (window.confirm(`${newName} is already added to phonebook, replace old number with a new one?`)) {
        const nameExists = persons.find(person => person.name === newName)
        const id = nameExists ? nameExists.id : null;
        const changedEntry = {...nameExists, number: newPhone}
      
        personService
        .modifyData(id,changedEntry)
        .then(response => {
          setPersons(persons.map(person => person.id !== id ? person : response.data))
        })
        .catch((error) => {
          console.log('Error occurred while updating a phone number', error)
        })
      }
    }
  }

  const deletePerson = (id, name) => {
    if (window.confirm(`Delete ${name}?`)) {
      personService
      .deleteData(id)
      .then(() => {
        setPersons(persons.filter(person => person.id !== id))
      })
      .catch((error) => {
        console.log('Error occurred while deleting a contact', error)
      })
    }
  }

  const handlePersonChange = (event) => {
    setNewName(event.target.value)
  }

  const handlePhoneChange = (event) => {
    setNewPhone(event.target.value)
  }

  const handleSearchChange = (event) => {
    setSearchTerm(event.target.value)
  };

  return (
    <div>
      <h2>Phonebook</h2>
      <Filter searchTerm={searchTerm} handleSearchChange={handleSearchChange}/>
      <h2>Add a new contact</h2>
      <PersonForm
        addPerson={addPerson}
        newName={newName}
        handlePersonChange={handlePersonChange}
        newPhone={newPhone}
        handlePhoneChange={handlePhoneChange}
      />
      <h2>Numbers</h2>
      <Persons personsToShow={personsToShow} deleteEntry={deletePerson}/>
    </div>
  )
}

export default App