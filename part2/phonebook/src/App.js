import { useState, useEffect } from 'react'
import personService from './services/persons'
import styled from 'styled-components'

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

const NotificationSuccess = styled.div`
  background-color: #58cc02;
  color: white;
  font-family: 'Roboto', sans-serif;
  font-size: 16px;
  border-style: solid;
  border-radius: 5px;
  padding: 10px;
  margin-bottom: 10px;
  width: 50%;
`

const NotificationError = styled.div`
  background-color: #ff4b4b;
  color: white;
  font-family: 'Roboto', sans-serif;
  font-size: 16px;
  border-style: solid;
  border-radius: 5px;
  padding: 10px;
  margin-bottom: 10px;
  width: 50%;
`

const Notification = ({message, statusCode}) => {
  if (message === null) {
    return null;
  }
  if (statusCode === 0) {
    return (
      <NotificationSuccess>
        {message}
      </NotificationSuccess>
    )
  }
  else if (statusCode === 1) {
    return (
      <NotificationError>
        {message}
      </NotificationError>
    )
  }
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
  const [notificationMessage, setNotificationMessage] = useState(null)
  const [statusCode, setStatusCode] = useState(0)

  const personsToShow = showMatch
  ? persons.filter(person => person.name && person.name.toLowerCase().includes(searchTerm.toLowerCase()))
  : persons

  const addPerson = (event) => {
    event.preventDefault()
    const nameExists = persons.some((person) => person.name === newName)
    if (!nameExists) {
      const personObject = { name: newName, number: newPhone }
      setPersons(persons.concat(personObject))

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
          setStatusCode(1)
          setNotificationMessage(`Information on ${newName} has already been removed from server.`, statusCode)
          setTimeout(() => {
            setNotificationMessage(null)
          }, 5000)
          setNewName('')
          setNewPhone('')

          personService
          .getData()
          .then(response => {
            setPersons(response.data)
          })
        })
      }
    }
    setStatusCode(0)
    setNotificationMessage(`Added '${newName}'`, statusCode)
    setTimeout(() => {
      setNotificationMessage(null)
    }, 5000)
    setNewName('')
    setNewPhone('')
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
      <Notification message={notificationMessage} statusCode={statusCode}/>
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