import { useState, useEffect } from "react";

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

  const [apiLink, setApiLink] = useState(
    `https://api.weatherapi.com/v1/current.json?key=46fb6895d1de4ad9b14163630230911&q=${location}&aqi=no`
  );

  const sunny = (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="128"
      height="128"
      xml:space="preserve"
    >
      <path
        fill="#FFF"
        d="m89.717 17.396 3.928.847-2.67 12.383-3.927-.846zM69.924 18.72l3.854 12.066-3.828 1.223-3.854-12.066zM49.612 31.039l9.344 8.514-2.706 2.97-9.345-8.513zM109.038 83.369l9.343 8.515-2.706 2.97-9.343-8.516zM115.679 67.377l12.33 2.681-.854 3.926-12.33-2.681zM125.457 46.337l1.231 3.824-12.016 3.87-1.231-3.825zM111.452 27.057l2.983 2.694-8.477 9.387-2.983-2.694z"
      />
      <g>
        <path
          fill="#FFF"
          d="m94.467 89.071-1.672-3.652c8.753-4.003 14.407-12.824 14.407-22.477 0-13.604-11.016-24.671-24.556-24.671-9.563 0-18.328 5.646-22.325 14.385l-3.653-1.672c4.649-10.163 14.848-16.73 25.979-16.73 15.755 0 28.573 12.87 28.573 28.688 0 11.22-6.576 21.476-16.753 26.129z"
        />
      </g>
      <g>
        <path
          fill="#FFF"
          d="M93.46 110.602H18.509C8.303 110.602 0 102.265 0 92.017c0-8.853 6.185-16.376 14.649-18.175.795-15.373 13.506-27.634 29.017-27.634 13.715 0 25.558 9.756 28.396 23.024a19.928 19.928 0 0 1 3.366-.29c11.27 0 20.439 9.207 20.439 20.523 0 .148-.002.298-.006.449 4.648 1.077 8.046 5.219 8.044 10.202.001 5.782-4.685 10.486-10.445 10.486zM43.666 50.226c-13.806 0-25.039 11.281-25.039 25.147l.005 1.971-1.779.205c-7.317.84-12.835 7.061-12.835 14.468 0 8.032 6.501 14.567 14.491 14.567H93.46c3.544 0 6.428-2.901 6.428-6.468.002-3.515-2.732-6.349-6.227-6.452l-2.185-.065.249-2.172c.084-.73.124-1.372.124-1.961 0-9.102-7.367-16.506-16.421-16.506-1.46 0-2.953.211-4.438.628l-2.221.623-.312-2.286c-1.686-12.37-12.345-21.699-24.791-21.699z"
        />
      </g>
      <g>
        <path
          fill="#FFF"
          d="m27.925 76.648-4.018-.016c.043-11.628 9.502-21.089 21.085-21.089v4.018c-9.376.001-17.032 7.667-17.067 17.087z"
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
            //console.log(e);
            setLocation([e.coords.latitude, e.coords.longitude]);
            //setSearchVar(location);

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
      setIsLoading(false);
    } catch (error) {
      setError(error);
      alert(error);
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
        <div className="flex flex-col md:flex-row md:justify-between items-center gap-2 md:gap-0 mb-10 md:mb-0">
          <h1 className="text-3xl font-bold">Weather Forecast</h1>

          <p className="">{time}</p>
        </div>

        <div className="searchSection">
          <input
            type="text"
            className="searchBar"
            value={searchVar}
            onChange={(e) => {
              setSearchVar(e.target.value);
              //console.log(searchVar);
            }}
          />

          <button
            className="searchBtn"
            onClick={() => {
              setApiLink(
                `https://api.weatherapi.com/v1/current.json?key=46fb6895d1de4ad9b14163630230911&q=${searchVar}&aqi=no`
              );
              fetchData();
            }}
          >
            Search
          </button>
        </div>
      </header>

      <main className="resultsContainer">
        <div className="temperatureContainer">
          <h1 className="tempImg mt-10">{sunny}</h1>

          <div>
            <h1 className="temp">{temp}</h1>

            <p className="text-center text-sm italic mt-3">
              Feels like {feelsLike}
            </p>

            <p className="location">
              {city},{country}
            </p>
          </div>

          <div className="minorDetails">
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
          </div>
        </div>
      </main>
    </div>
  );
}

export default App;
