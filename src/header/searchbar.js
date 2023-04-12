import React, { useState } from 'react'
import { ReactSearchAutocomplete } from 'react-search-autocomplete'
import { Navigate, useNavigate } from 'react-router-dom'
import { Location } from 'react-router-dom'

// I am using a library in my search bar to autocomplete the text.
// The current setup allows the user to browse to categories or subcategories.  
function Searchbar() {
  // note: the id field is mandatory
  const items = [
    {
      id: 0,
      path: '/subcategoryTelevisions',
      name: 'televisions'
    },
    {
      id: 1,
      path: '/subcategoryPhones',
      name: 'phones'
    },
    {
      id: 2,
      path: '/subcategoryGameConsoles',
      name: 'game consoles'
    },
    {
      id: 3,
      path: '/subcategoryScience',
      name: 'science (books)'
    },
    {
      id: 4,
      path: '/subcategoryHistory',
      name: 'history (books)'
    },
    {
      id: 5,
      path: '/subcategoryBiography',
      name: 'biography (books)'
    },
    {
      id: 6,
      path: '/categoryElectronics',
      name: 'electronics'
    },
    {
      id: 7,
      path: '/categoryBooks',
      name: 'books'
    }
    
  ]
  const navigate = useNavigate(); // get the navigate function

  const [input, setInput] = useState()

  const handleKeyDown = (event) => {
    if(event.key === 'Enter' && input != undefined) {
      navigate(input.path)
      setInput()
    }
  }

  const handleOnSearch = (string, results) => {
    // onSearch will have as the first callback parameter
    // the string searched and for the second the results.
    console.log(results[0])
    setInput(results[0])

  }

  const handleOnSelect = (item) => {
    // the item selected
    navigate(item.path)

  }

  const formatResult = (item) => {
    return (
      <>

        <span style={{ display: 'block', textAlign: 'left' }}>{item.name}</span>
      </>
    )
  }

  return (
    <div className="App">
      <header className="App-header">
        <div onKeyDown={handleKeyDown} className='searchInput' style={{ maxwidth: 400 }}>
          <ReactSearchAutocomplete
            items={items}
            onSearch={handleOnSearch}
            onSelect={handleOnSelect}
            autoFocus
            formatResult={formatResult}
            showNoResults={false}
          />
        </div>
      </header>
    </div>
  )
}

export default Searchbar;