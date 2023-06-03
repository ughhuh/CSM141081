import { useState } from 'react'

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
    <InputField name="name: " value={newName} onChange={handlePersonChange}/>
    <InputField name="number: " value={newPhone} onChange={handlePhoneChange}/>
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

const Persons = ({personsToShow}) => {
  return (
    <div>
    {personsToShow.map((person) => (
      <PersonInfo person={person}/>
    ))}
  </div>
  )
}

const PersonInfo = ({person}) => {
  return (<p key={person.name}>{person.name} {person.number}</p>)
}

const App = () => {
  const [persons, setPersons] = useState([
    { name: 'Arto Hellas', number: '040-123456', id: 1 },
    { name: 'Ada Lovelace', number: '39-44-5323523', id: 2 },
    { name: 'Dan Abramov', number: '12-43-234345', id: 3 },
    { name: 'Mary Poppendieck', number: '39-23-6423122', id: 4 }
  ])
  
  const [newName, setNewName] = useState('')
  const [newPhone, setNewPhone] = useState('')
  const [searchTerm, setSearchTerm] = useState('')
  const [showMatch, setShowMatch] = useState(true)

  const personsToShow = showMatch
  ? persons.filter(person => person.name.toLowerCase().includes(searchTerm.toLowerCase()))
  : persons

  const addPerson = (event) => {
    event.preventDefault()
    const nameExists = persons.some((person) => person.name === newName)
    if (!nameExists) {
      const personObject = { name: newName, number: newPhone }
      setPersons(persons.concat(personObject))
      setNewName('')
    }
    else {
      window.alert(`${newName} is already added to phonebook`)
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
        addPerson = {addPerson}
        newName = {newName}
        handlePersonChange = {handlePersonChange}
        newPhone = {newPhone}
        handlePhoneChange = {handlePhoneChange}
      />
      <h2>Numbers</h2>
      <Persons personsToShow={personsToShow}/>
    </div>
  )
}

export default App