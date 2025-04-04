import React, { useState, useEffect, useRef } from 'react';
import styles from './FoodSearch.module.css';
import 'bootstrap/dist/css/bootstrap.min.css';
import DisplayFood from './DisplayFood';


const APP_ID = '3904677f';
// bc24ce5b 3d8916da
const API_KEY = '6411aa628efba5b83aba8f6cd0f6b4c2';
// 129c8e03bf040c6cb06e1ca453a6a91d a4bbce0614c3b9212bbc2a51a4ca334b
function FoodSearch() {
  const [searchTerm, setSearchTerm] = useState('');
  const [results, setResults] = useState([]);
  const [suggestions, setSuggestions] = useState([]);
  const inputRef = useRef(null);
  const dropdownRef = useRef(null);

  useEffect(() => {
    function handleClickOutside(event) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target) && !inputRef.current.contains(event.target)) {
        setSuggestions([]);
      }
    }

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [dropdownRef]);

  async function searchFood(item) {
    const endpoint = `https://trackapi.nutritionix.com/v2/search/instant?query=${encodeURIComponent(item)}`;
    
    const response = await fetch(endpoint, {
      method: 'GET',
      headers: {
        'x-app-id': APP_ID,
        'x-app-key': API_KEY,
        'x-remote-user-id': '0',
      },
    });

    if (response.ok) {
      const data = await response.json();
      displayResults(data);
    } else {
      console.error('Error fetching data:', response.statusText);
    }
  }

  function displayResults(data) {
    if (data && data.common && data.common.length > 0) {
      setResults(data.common);
    } else {
      setResults([]);
    }
  }

  const handleSearch = () => {
    searchFood(searchTerm);
    setSuggestions([]);
  };

  const handleKeyPress = (event) => {
    if (event.key === 'Enter') {
      handleSearch();
    }
  };

  const handleClearSearch = () => {
    setSearchTerm('');
    setResults([]);
    setSuggestions([]);
  };

  const handleInputChange = async (event) => {
    const value = event.target.value;
    setSearchTerm(value);
    
    if (value.length > 2) {
      const endpoint = `https://trackapi.nutritionix.com/v2/search/instant?query=${encodeURIComponent(value)}`;
      
      const response = await fetch(endpoint, {
        method: 'GET',
        headers: {
          'x-app-id': APP_ID,
          'x-app-key': API_KEY,
          'x-remote-user-id': '0',
        },
      });

      if (response.ok) {
        const data = await response.json();
        setSuggestions(data.common || []);
      }
    } else {
      setSuggestions([]);
    }
  };

  const handleSuggestionClick = (suggestion) => {
    setSearchTerm(suggestion.food_name);
    setSuggestions([]);
    searchFood(suggestion.food_name);
  };


  return (
    <div className={`container mx-5 my-4 center ${styles.customContainer}`}>
      <div className={`row mb-3 position-relative ${styles.ib}`} style={results.length === 0 ? {
      position: 'absolute',
      left: '150%',

      width: '100%',
      maxWidth: '500px'
    } : {}}>
      <div className={`col-md-12 position-relative ${styles}`}>
        <div className={results.length === 0 ? 'text-center' : ''}>
          <input
            ref={inputRef}
            type="text"
            placeholder="Food Log"
            className={`form-control ${styles.inputBox}`}
            value={searchTerm}
            onChange={handleInputChange}
            onKeyPress={handleKeyPress}
          />
          {searchTerm && (
            <button 
            onClick={handleSearch} 
            className="btn btn-primary mt-3"
            style={{ width: '100%' }}  // Add this style
          >
            Search
          </button>
          )}
          {suggestions.length > 0 && (
            <ul ref={dropdownRef} className={`dropdown-menu show ${styles.suggestionsDropdown}`}>
              {suggestions.map((suggestion, index) => (
                <li
                  key={index}
                  className="dropdown-item"
                  onClick={() => handleSuggestionClick(suggestion)}
                >
                  {suggestion.food_name.charAt(0).toUpperCase() + suggestion.food_name.slice(1)}
                </li>
              ))}
            </ul>
          )}
          
        </div>
      </div>
    </div>
        

      
     
      <div className="row">
        {results.map((item, index) => (
          <div key={index} className="col-md-6 mb-4">
            <DisplayFood
              foodName={item.food_name.charAt(0).toUpperCase() + item.food_name.slice(1)}
              foodVariant={`Serving Size: ${item.serving_qty} ${item.serving_unit}`}
              imageUrl={item.photo.thumb}
              servings={item.alt_measures || [
                { serving_qty: item.serving_qty, serving_unit: item.serving_unit, 
                  nf_protein: item.nf_protein, nf_total_carbohydrate: item.nf_total_carbohydrate,
                   nf_total_fat: item.nf_total_fat, nf_sugars: item.nf_sugars, nf_sodium: item.nf_sodium }
              ]}
            />
          </div>
        ))}
      </div>

    </div>
  );
  
}

export default FoodSearch;
