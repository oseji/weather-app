import { useState, useEffect } from "react";
import { motion } from "framer-motion";

function App() {
  const [location, setLocation] = useState([]);
  const [apiData, setApiData] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  const [locationErr, setLocationErr] = useState(null);
  const [locationLoading, setLocationLoading] = useState(true);

  const [searchVar, setSearchVar] = useState("");
  const [temp, setTemp] = useState("0°C");
  const [feelsLike, setFeelsLike] = useState("0°C");
  const [wind, setWind] = useState("0%");
  const [humidity, setHumidity] = useState("0%");
  const [pressure, setPressure] = useState("0 in");
  const [city, setCity] = useState("");
  const [country, setCountry] = useState("");
  const [time, setTime] = useState("");
  const [lastUpdated, setLastUpdated] = useState("");

  const [apiLink, setApiLink] = useState(
    `https://api.weatherapi.com/v1/current.json?key=46fb6895d1de4ad9b14163630230911&q=${location}&aqi=no`
  );

  const pathVariants = {
    hidden: {
      pathLength: 0,
      opacity: 0,
    },
    visible: {
      pathLength: 1,
      opacity: 1,
      transition: { duration: 1.5 },
    },
  };

  const mapPin = (
    <svg
      className="w-6 h-6 text-gray-800 dark:text-white"
      aria-hidden="true"
      xmlns="http://www.w3.org/2000/svg"
      fill="none"
      viewBox="0 0 17 21"
    >
      <g
        stroke="currentColor"
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth="2"
      >
        <motion.path
          variants={pathVariants}
          initial="hidden"
          animate="visible"
          d="M8 12a3 3 0 1 0 0-6 3 3 0 0 0 0 6Z"
        />
        <motion.path
          variants={pathVariants}
          initial="hidden"
          animate="visible"
          d="M13.8 12.938h-.01a7 7 0 1 0-11.465.144h-.016l.141.17c.1.128.2.252.3.372L8 20l5.13-6.248c.193-.209.373-.429.54-.66l.13-.154Z"
        />
      </g>
    </svg>
  );

  //GET LOCATION
  useEffect(() => {
    const getLocation = () => {
      if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(
          (e) => {
            setLocation([e.coords.latitude, e.coords.longitude]);

            setApiLink(
              `https://api.weatherapi.com/v1/current.json?key=46fb6895d1de4ad9b14163630230911&q=${[
                e.coords.latitude,
                e.coords.longitude,
              ]}&aqi=no`
            );

            console.log(location);

            setLocationLoading(false);
          },
          (err) => {
            setLocationErr(err.message);
            console.log(locationErr);

            setLocationLoading(false);
          }
        );
      } else {
        setLocationErr("Location not available");
        console.log(locationErr);

        setLocationLoading(false);
      }

      // console.log(location);
    };

    getLocation();
  }, [locationLoading]);

  //FETCH DATA FROM API
  const fetchData = async () => {
    try {
      const response = await fetch(apiLink);

      if (!response.ok) {
        throw new Error("Network response was not ok");
      }

      const data = await response.json();
      setApiData(data);
      setTemp(`${data.current.temp_c}°C`);
      setFeelsLike(`${data.current.feelslike_c} °C`);
      setWind(`${data.current.wind_kph} km/h`);
      setHumidity(`${data.current.humidity} %`);
      setPressure(`${data.current.pressure_in} in`);
      setCity(data.location.name);
      setCountry(data.location.country);
      setTime(data.location.localtime);
      setLastUpdated(data.current.last_updated);

      setIsLoading(false);
    } catch (error) {
      setError(error);
      console.log(error);
    } finally {
      setIsLoading(false);
    }

    console.log(apiData);
  };

  useEffect(() => {
    if (!locationLoading) {
      fetchData();
    }
  }, [isLoading, apiLink]);

  return (
    <div className="app ">
      <header>
        <motion.div
          initial={{ opacity: 0, y: -200 }}
          animate={{ opacity: 1, y: 0, transition: { duration: 0.7 } }}
          className="flex flex-col md:flex-row md:justify-between items-center gap-2 md:gap-0 mb-10"
        >
          <h1 className="text-3xl font-bold">Weather Forecast</h1>

          <div className="flex flex-col items-center md:items-start text-sm">
            <p>Current time : {time}</p>
            <p>Last updated : {lastUpdated}</p>
          </div>
        </motion.div>

        <motion.form
          initial={{ opacity: 0, x: -150 }}
          animate={{ opacity: 1, x: 0, transition: { duration: 1 } }}
          onSubmit={(e) => {
            e.preventDefault();
            setApiLink(
              `https://api.weatherapi.com/v1/current.json?key=46fb6895d1de4ad9b14163630230911&q=${searchVar}&aqi=no`
            );
            fetchData();
            setSearchVar("");
          }}
          className="searchSection"
        >
          <input
            type="text"
            className="searchBar"
            value={searchVar}
            onChange={(e) => setSearchVar(e.target.value)}
          />

          <button
            className="searchBtn"
            onClick={() => {
              setApiLink(
                `https://api.weatherapi.com/v1/current.json?key=46fb6895d1de4ad9b14163630230911&q=${searchVar}&aqi=no`
              );
              fetchData();
              setSearchVar("");
            }}
          >
            Search
          </button>
        </motion.form>
      </header>

      <main className="resultsContainer">
        <div className="temperatureContainer">
          <div>
            <motion.div
              initial={{ opacity: 0, x: 300 }}
              animate={{ opacity: 1, x: 0, transition: { duration: 1 } }}
              className="flex flex-col md:flex-row items-center justify-center gap-2 md:gap-10 my-8"
            >
              <h1 className="text-7xl font-bold text-center">{temp}</h1>

              <p className="text-center text-sm italic md:my-3">
                Feels like {feelsLike}
              </p>
            </motion.div>

            <div className="flex flex-row justify-center gap-4 items-center">
              <div>{mapPin}</div>
              <motion.p
                initial={{ opacity: 0 }}
                animate={{ opacity: 1, transition: { duration: 1.5 } }}
                className="text-center"
              >
                {city},{country}
              </motion.p>
            </div>
          </div>

          <motion.div
            initial={{ opacity: 0, x: -300 }}
            animate={{ opacity: 1, x: 0, transition: { duration: 1 } }}
            className="minorDetails"
          >
            <div className="detail">
              <p className="detailName">Wind</p>
              <p className="detailValue">{wind}</p>
            </div>
            <div className="detail">
              <p className="detailName">Humidity</p>
              <p className="detailValue">{humidity}</p>
            </div>
            <div className="detail">
              <p className="detailName">Pressure</p>
              <p className="detailValue">{pressure}</p>
            </div>
          </motion.div>
        </div>
      </main>
    </div>
  );
}

export default App;
