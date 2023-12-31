import React, {useEffect, useState} from "react";
import './assets/style/view_weather_styles.css';
import backLogo from './assets/images/back.png';
import axios from "axios";
import {Link, useNavigate, useParams} from "react-router-dom";
import arrowlogo from "./assets/images/arrow.svg";
import cardImage from "./assets/images/broken clouds.png";
import {convertTimestampTpTime, getImageForWeather} from "./Dashboard";


function View_Weather() {
    const [weatherData, setData] = useState([]);
    const {q} = useParams();

    useEffect(() => {
            console.log('Requested Country - ', q);
            const appid = '1f7c1264db89c3babe0720b2bc23fa92';
            axios.get('https://api.openweathermap.org/data/2.5/weather?q=' + q + '&appid=' + appid)
                .then(res => {
                    // debugger;
                    setData(res.data);
                })
                .catch(error => console.log(error));
        }
        , []);

    useEffect(() => {
        console.log('weatherData changed sys:', sys);
    }, [weatherData]); // Dependency array with 'weatherData' means this effect runs whenever 'weatherData' changes


    const currentDate = new Date();
    const {sys} = weatherData || {};
    const {main} = weatherData || {};
    const {wind} = weatherData || {};
    const {weather} = weatherData || {};

    return (
        <div className="container-fluid weather-content">
            <div className="row justify-content-center align-items-center">
                <div className="col-9 col-sm-9 col-md-8 col-lg-7 col-xl-6 col-xxl-6">
                    <div className="card single-card">
                        <Link to="/" type="button" className="back-button small-btn-img">
                            <img src={backLogo} alt="Close Button"></img>
                        </Link>
                        {weather ? (
                            <img src={getImageForWeather(weatherData)} className="card-img-top weather-image" alt={`Weather image for ${weather.name}`}>
                            </img>
                        ) : (
                            <p>Weather information not available</p>
                        )}

                        <div className="card-img-overlay row">
                            <div className="col-6">
                                {sys ? (
                                    <h5>{weatherData.name}, {sys.country}</h5>
                                ) : (
                                    <p>Weather information not available</p>
                                )}
                                <p>{convertTimestampTpTime(weatherData.dt)}, {currentDate.toLocaleString('default', {month: 'short'})} {currentDate.getDate()}</p>
                            </div>
                            <div className="col-6">
                                {main ? (
                                    <>
                                        <h3 className="card-title">{main.temp}°c</h3>
                                        <p>Temp Min: {main.temp_min}°c</p>
                                        <p>Temp Max: {main.temp_max}°c</p>
                                    </>
                                ) : (
                                    <p>Weather information not available</p>
                                )}
                            </div>
                        </div>
                        <div className="card-body">
                            <div className="row">
                                <div className="col-4">
                                    {main ? (
                                        <>
                                            <p>Pressure: {main.pressure}Pa</p>
                                            <p> Humidity: {main.humidity}%</p>
                                            <p>Visibility: {weatherData.visibility} km</p>
                                        </>
                                    ) : (
                                        <p>Weather information not available</p>
                                    )}
                                </div>
                                <div className="col-4">
                                    {wind ? (
                                        <>
                                            <img src={arrowlogo} alt="SVG Arrow" className="mb-2"></img>
                                            <p>{wind.speed}m/s {wind.deg} Degree</p>
                                        </>
                                    ) : (
                                        <p>Weather information not available</p>
                                    )}
                                </div>
                                <div className="col-4 mt-2">
                                    {sys ? (
                                        <>
                                            <p>Sunrise: {convertTimestampTpTime(sys.sunrise)}</p>
                                            <p>Sunset: {convertTimestampTpTime(sys.sunset)}</p>
                                        </>
                                    ) : (
                                        <p>Weather information not available</p>
                                    )}
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default View_Weather;