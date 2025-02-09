const pokedex = document.getElementById('pokedex');
const searchInput = document.getElementById('searchInput');
const searchButton = document.getElementById('searchButton');
let allPokemon = [];

// Function to capitalize the first letter of a string
const capitalizeFirstLetter = (string) => {
    return string.charAt(0).toUpperCase() + string.slice(1);
};

// Fetch Pokémon data
const fetchPokemon = async () => {
    const url = 'https://pokeapi.co/api/v2/pokemon?limit=1008';
    const response = await fetch(url);
    const data = await response.json();
    const promises = data.results.map(async (pokemon) => {
        const res = await fetch(pokemon.url);
        const pokeData = await res.json();
        const types = pokeData.types.map(typeInfo => capitalizeFirstLetter(typeInfo.type.name));
        return {
            name: capitalizeFirstLetter(pokeData.name),
            image: pokeData.sprites.front_default,
            id: pokeData.id,
            types: types.join(', '),
            height: pokeData.height,
            weight: pokeData.weight,
            abilities: pokeData.abilities.map(ability => capitalizeFirstLetter(ability.ability.name)).join(', '),
            stats: pokeData.stats.map(stat => `${capitalizeFirstLetter(stat.stat.name)}: ${stat.base_stat}`).join(', ')
        };
    });
    allPokemon = await Promise.all(promises);
    console.log(allPokemon);
    displayPokemon(allPokemon);
};

// Display Pokémon
const displayPokemon = (pokemonList) => {
    const pokemonHTML = pokemonList
        .map(
            (pokemon) => `
        <div class="pokemon-card">
            <div class="pokemon-card-inner">
                <div class="pokemon-card-front">
                    <img src="${pokemon.image}" alt="${pokemon.name}" />
                    <h2>${pokemon.name}</h2>
                    <p>#${pokemon.id.toString().padStart(3, '0')}</p>
                </div>
                <div class="pokemon-card-back">
                    <h2>${pokemon.name}</h2>
                    <p>ID: #${pokemon.id}</p>
                    <p>Type(s): ${pokemon.types}</p>
                    <p>Height: ${pokemon.height}</p>
                    <p>Weight: ${pokemon.weight}</p>
                    <p>Abilities: ${pokemon.abilities}</p>
                    <p>Stats: ${pokemon.stats}</p>
                </div>
            </div>
        </div>
    `
        )
        .join('');
    pokedex.innerHTML = pokemonHTML;
    addFlipEventListeners();
};

// Add event listeners to flip cards
const addFlipEventListeners = () => {
    const cards = document.querySelectorAll('.pokemon-card');
    cards.forEach((card) => {
        card.addEventListener('click', () => {
            card.classList.toggle('flipped');
        });
    });
};

// Search Pokémon
const searchPokemon = () => {
    const searchTerm = searchInput.value.toLowerCase();
    const filteredPokemon = allPokemon.filter(pokemon =>
        pokemon.name.toLowerCase().includes(searchTerm)
    );
    displayPokemon(filteredPokemon);
};

searchButton.addEventListener('click', searchPokemon);
searchInput.addEventListener('keypress', (event) => {
    if (event.key === 'Enter') {
        searchPokemon();
    }
});

// Fetch weather data
const fetchWeatherData = async () => {
    try {
        const url = 'https://api.open-meteo.com/v1/forecast?latitude=14.5995&longitude=120.9842&current_weather=true'; // Weather API URL for Manila, Philippines
        const response = await fetch(url);
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        const data = await response.json();
        displayWeatherData(data.current_weather);
    } catch (error) {
        console.error('Error fetching weather data:', error);
    }
};

// Display weather data
const displayWeatherData = (weather) => {
    const weatherHTML = `
        <div class="weather">
            <h2>Current Weather</h2>
            <p>Temperature: ${weather.temperature}°C</p>
            <p>Wind Speed: ${weather.windspeed} km/h</p>
        </div>
    `;
    document.getElementById('weather').innerHTML = weatherHTML;
};

// Fetch cryptocurrency prices
const fetchCryptoPrices = async () => {
    const url = 'https://api.coingecko.com/api/v3/simple/price?ids=bitcoin,ethereum,dogecoin&vs_currencies=usd'; // Updated API URL
    const response = await fetch(url);
    const data = await response.json();
    displayCryptoPrices(data);
};

// Display cryptocurrency prices
const displayCryptoPrices = (prices) => {
    const pricesHTML = `
        <div class="crypto">
            <h2>Cryptocurrency Prices</h2>
            <p>Bitcoin: $${prices.bitcoin.usd}</p>
            <p>Ethereum: $${prices.ethereum.usd}</p>
            <p>Dogecoin: $${prices.dogecoin.usd}</p> <!-- Added Dogecoin -->
        </div>
    `;
    document.getElementById('crypto').innerHTML = pricesHTML;
};

fetchPokemon();
fetchWeatherData();
fetchCryptoPrices();
