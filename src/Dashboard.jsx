import React, {useEffect, useState} from "react";
import closelogo from './assets/images/close.png';
import arrowlogo from './assets/images/arrow.svg';
import clearSkyImage from './assets/images/clear sky.png';
import FewImage from './assets/images/few clouds.png';
import intensityDrizzleImage from './assets/images/light intensity drizzle.png';
import lightRainImage from './assets/images/light rain.png';
import mistImage from './assets/images/mist.png';
import moderateRainImage from './assets/images/moderate rain.png';
import overcastCloudsImage from './assets/images/overcast clouds.png';
import scatteredCloudsImage from './assets/images/scattered clouds.png';
import brokenImage from './assets/images/broken clouds.png';
import defaultCloudyImage from './assets/images/defaultcloudy.png';
import fogImage from './assets/images/fog.png';
import axios from "axios";
import {Link} from "react-router-dom";

// import './assets/style/style.css';

function Dashboard() {
    const [jsonData, setJsonData] = useState([]);
    // const [cities, setCityCodes] = useState([]);
    const [weatherData, setWeatherData] = useState([]);


    //Effect Hooks to connect and read data
    useEffect(() => {
        // debugger;
        // Axios request to read json
        axios.get('http://localhost:3000/List')
            .then(res => {
                // debugger;
                console.log('Fetch data from json:', res);
                setJsonData(res.data);
            })
            .catch(error => console.error('Error found while fetching data:', error));
    }, []);

    useEffect(() => {
        const fetchWeatherData = async () => {
            // debugger;
            const appid = '1f7c1264db89c3babe0720b2bc23fa92';

            // Convert array to a comma-separated string (you can adjust this based on your API's requirements)
            const jsonDataString = jsonData.map(city => city && encodeURIComponent(city.CityCode)).join(',');
            const apiUrl = `http://api.openweathermap.org/data/2.5/group?id=${jsonDataString}&appid=${appid}&units=metric`;

            try {
                if (jsonData.length === 0) {
                    console.log('jsonData is empty');
                } else {
                    const cachedData = getCachedData(apiUrl);
                    if (cachedData) {
                        console.log('Using cached data:', cachedData);
                        setWeatherData(cachedData);
                    } else {
                        console.log('Fetching new weather data');
                        const response = await axios.get(apiUrl);
                        setWeatherData(response.data.list);
                        cacheData(apiUrl, response.data.list);
                    }
                }
            } catch (error) {
                console.error('Error fetching weather data:', error);
            }
        };
        fetchWeatherData();
    }, [jsonData]); // Dependency array with 'data' means this effect runs whenever 'data' changes


    useEffect(() => {
        // console.log('weatherData changed:', weather);
    }, [weatherData]); // Dependency array with 'weatherData' means this effect runs whenever 'weatherData' changes

    const currentDate = new Date();

    const handleRemoveCard = (index) => {
        // Create a copy of the array excluding the element to be removed
        const updatedWeatherData = [...weatherData];
        updatedWeatherData.splice(index, 1);
        setWeatherData(updatedWeatherData);
    };

    const handleCloseButtonClick = (event, index) => {
        // Prevent the click event from propagating to the parent elements
        event.stopPropagation();
        handleRemoveCard(index);
        event.preventDefault();
    };

    const cacheData = (key, data) => {
        const now = new Date();
        const expirationTime = now.getTime() + 5 * 60 * 1000; // 5 minutes
        const cacheObject = { data, expirationTime };
        localStorage.setItem(key, JSON.stringify(cacheObject));
    };

    const getCachedData = (key) => {
        const cachedItem = localStorage.getItem(key);
        if (cachedItem) {
            const { data, expirationTime } = JSON.parse(cachedItem);
            const now = new Date();
            if (now.getTime() < expirationTime) {
                return data;
            } else {
                localStorage.removeItem(key);
            }
        }
        return null;
    };

    return (
        <div className="container-fluid weather-content mt-5">
            <form className="row justify-content-center">
                <div className="col-auto">
                    <input type="text" className="form-control search-input" id="cityInput"
                           placeholder="Enter a city"></input>
                    <button type="submit" className="btn btn-primary search-button" id="add-city-btn">Add City</button>
                </div>
            </form>
            <div className='justify-content-center align-items-center row'>
                {
                    weatherData.map((weather, index) => {
                        return (
                            <div key={index} className="col-10 col-sm-8 col-md-7 col-lg-5 col-xl-4 col-xxl-4 mb-4 m-2">
                                <Link to={`/view_weather/${weather.name}`}>
                                    <div className="card" id={index}>
                                        <button type="button" className="close-button small-btn-img" aria-label="Close" onClick={(event) => handleCloseButtonClick(event, index)}>
                                            <img src={closelogo} alt="Close Button" />
                                        </button>
                                        <img src={getImageForWeather(weather)} className="card-img-top weather-image" alt={`Weather image for ${weather.name}`}>
                                        </img>
                                        <div className="card-img-overlay row">
                                            <div className="col-6">
                                                <h5>{weather.name}, {weather.sys.country}</h5>
                                                <p>{convertTimestampTpTime(weather.dt)}, {currentDate.toLocaleString('default', {month: 'short'})} {currentDate.getDate()}</p>
                                            </div>
                                            <div className="col-6">
                                                <h3 className="card-title">{weather.main.temp}°c</h3>
                                                <p>Temp Min: {weather.main.temp_min}°c</p>
                                                <p>Temp Max: {weather.main.temp_max}°c</p>
                                            </div>
                                        </div>
                                        <div className="card-body">
                                            <div className="row">
                                                <div className="col-4">
                                                    <p>Pressure: {weather.main.pressure}Pa</p>
                                                    <p> Humidity: {weather.main.humidity}%</p>
                                                    <p>Visibility: {weather.visibility}km</p>
                                                </div>
                                                <div className="col-4">
                                                    <img src={arrowlogo} alt="SVG Arrow" className="mb-2"></img>
                                                    <p>{weather.wind.speed}m/s {weather.wind.deg} Degree</p>
                                                </div>
                                                <div className="col-4 mt-2">
                                                    <p>Sunrise: {convertTimestampTpTime(weather.sys.sunrise)}</p>
                                                    <p>Sunset: {convertTimestampTpTime(weather.sys.sunset)}</p>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </Link>
                            </div>
                        );
                    })}
            </div>
        </div>
    );
}

export const getImageForWeather = (weather) => {
    // Logic to determine and return the image URL based on weather data
    switch (weather.weather[0].description) {
        case 'broken clouds':
            return brokenImage;
        case 'clear sky':
            return clearSkyImage;
        case 'few clouds':
            return FewImage;
        case 'fog':
            return fogImage;
        case 'light intensity drizzle':
            return intensityDrizzleImage;
        case 'light rain':
            return lightRainImage;
        case 'mist':
            return mistImage;
        case 'moderate rain':
            return moderateRainImage;
        case 'scattered clouds':
            return scatteredCloudsImage;
        case 'overcast clouds':
            return overcastCloudsImage;
        // Add more cases as needed
        default:
            return defaultCloudyImage;
    }
};

export const convertTimestampTpTime = (timestamp) => {
    // Convert seconds to milliseconds
    var date = new Date(timestamp * 1000); // Convert seconds to milliseconds
    var hours = date.getHours();
    var minutes = "0" + date.getMinutes();
    var period = hours >= 12 ? 'pm' : 'am';
    hours = hours % 12 || 12; // Convert 0 to 12 for midnight
    return hours + ':' + minutes.substr(-2) + '' + period;
};

export default Dashboard;

