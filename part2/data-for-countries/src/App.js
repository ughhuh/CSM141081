import { useState, useEffect } from 'react'
import axios from 'axios'

const Filter = ({searchTerm, handleSearchChange}) => {
  return (
    <div>
      find countries <input
        value={searchTerm}
        onChange={handleSearchChange}
      />
    </div>
  )
}

const CountryList = ({countries, handleShowCountry}) => {
  if (countries.length > 10) {
    return (<p>Too many matches, specify another filter</p>)
  }
  else if (countries.length === 1) {
    return (<CountryHighlight country={countries[0]}/>)
  }
  else {
  return (
    <ul>
      {countries.map((country) => (<li key={country}>{country} <ShowButton country={country} handleShowCountry={handleShowCountry}/> </li>))}
    </ul>
  )
  }
}

const CountryHighlight = ({country}) => {
  const [countryData, setCountryData] = useState(null)
  
  useEffect(() => {
    const fetchData = async () => {
      const response = await axios.get(`https://restcountries.com/v3/name/${country}`)
      setCountryData(response.data)
    }
    fetchData()
  }, [country])

  if (!countryData) {
    return <div>Loading...</div>
}
  else {
    const flagUrl = countryData[0].flags[1] // this took me an hour simply because the browser removed the keys for flags object. i hate it here
    console.log(countryData[0].flags)
    return (
      <div>
        <h2>{countryData[0].name.common}</h2>
        <p>capital {countryData[0].capital}</p>
        <p>area {countryData[0].area}</p>
        <Languages countryData={countryData[0].languages}/>
        <img src={flagUrl} alt={countryData[0].name.common}></img>
      </div>
    )
  }
}

const Languages = ({countryData}) => {
  const languages = Object.values(countryData);
  return (
    <div>
      <h3>languages:</h3>
        <ul>
        {languages.map((lang) => (<li key={lang}>{lang}</li>))}
        </ul>
    </div>
  )
}

const ShowButton = ({ country, handleShowCountry }) => {
  const handleClick = () => {
    handleShowCountry(country)
  }

  return (<button onClick={() => handleClick()}>Show</button>)
}

const App = () => {
  const [searchTerm, setSearchTerm] = useState('')
  const [countries, setCountries] = useState([])
  const [selectedCountry, setSelectedCountry] = useState(null)

  useEffect(() => {
    console.log('effect run, countries is now', countries)

    if (!countries.length) {
      console.log('fetching country list...')
      axios
        .get(`https://restcountries.com/v3/all`)
        .then(response => {
          const countryNames = response.data.map(country => country.name.common)
          setCountries(countryNames)
        })
        .catch(error => {
          console.log('Error occurred while fetching country list:', error)
        })
    }
  }, [countries])

  const handleSearchChange = (event) => {
    setSearchTerm(event.target.value)
  }

  const handleShowCountry = (country) => {
    setSelectedCountry(country)
  }

  const countriesToShow = countries.filter(country => country.toLowerCase().includes(searchTerm.toLowerCase()))

  return (
    <div>
      <h2>Country Data</h2>
      <Filter searchTerm={searchTerm} handleSearchChange={handleSearchChange} />
      <CountryList countries={countriesToShow} handleShowCountry={handleShowCountry}/>
      {selectedCountry && <CountryHighlight country={selectedCountry} />}
    </div>
  )
}

export default App