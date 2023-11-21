import { useState } from "react";
import "./App.css";
import axios from "axios";
import { nanoid } from "nanoid";
import Card from "react-bootstrap/Card";

function App() {
  const [data, setData] = useState({});
  const [location, setLocation] = useState("");
  const [index, setIndex] = useState(null);
  const [days, setDays] = useState([]);
  const [previousCities, setPreviousCities] = useState([]);
  //const url = `https://api.openweathermap.org/data/2.5/weather?&q=${location}&units=imperial&appid=0cea07e52143f44c4126cfadaa15cd14`
  // const url = `https://api.openweathermap.org/data/2.5/forecast?q=${location}&APPID=0cea07e52143f44c4126cfadaa15cd14`;
  const url = `https://api.openweathermap.org/data/2.5/forecast?q=${location}&APPID=0cea07e52143f44c4126cfadaa15cd14`;

  //let tmp = data.list[index].dt_txt.slice(8, 10);
  //const tmp = data.list[index].dt_txt.slice(8, 10);
  function filterDate(data) {
    data.list.map((element) => {
      const date = new Date(element.dt_txt);
      //let  array = element.dt_txt;

      //console.log(date);
    });
  }

  function filterDates(data) {
    const filteredDays = data.list
      .filter((element) => {
        return element.dt_txt.split(" ")[1] === "00:00:00" ;
      })
      .map((element) => {
        return {
          id: nanoid(),
          date: element.dt_txt.split(" ")[0],
          weather_desc: element.weather[0].main,
          icon: element.weather[0].icon,
          temp: element.main.temp,
        };
      });

    setDays(filteredDays); // Update the 'days' state array
    
  }

  const getDay = (date) => {
    let weekday = new Array(7);
    weekday[0] = "Sunday";
    weekday[1] = "Monday";
    weekday[2] = "Tuesday";
    weekday[3] = "Wednesday";
    weekday[4] = "Thursday";
    weekday[5] = "Friday";
    weekday[6] = "Saturday";

    return weekday[new Date(date).getDay()];
  };


  
  const searchLocation = (event) => {
    if (event.key === "Enter") {
      axios.get(url).then((response) => {
        const previousCities = JSON.parse(localStorage.getItem("previousCities")) || [];
        previousCities.push(response.data.city.name);
        localStorage.setItem("previousCities", JSON.stringify(previousCities));
        setData(response.data);
      
       // console.log(response.data)
        filterDate(response.data);
        // filterDate2(response.data)
        filterDates(response.data);
      });
      setLocation("");
    }
  };


  

  return (
    <>
      <div className="container text-center">
        <div className=" row app ">
          <div className="search">
            <input
              value={location}
              onChange={(event) => setLocation(event.target.value)}
              onKeyPress={searchLocation}
              placeholder="Enter Location"
              type="text"
            />
          </div>
          <div className="previous-cities">
            {previousCities.map((city) => (
              <div
                key={city}
                className="previous-city"
                onClick={() => setLocation(city)}
              >
                {city}
              </div>
            ))}
          </div>
          <div className="text-center previous-cities">
        {localStorage.getItem("previousCities") &&
          JSON.parse(localStorage.getItem("previousCities")).map((city) => (
            <div
              key={city}
              className="previous-city" 
              onClick={() => setLocation(city)}
            >
              {}
            </div>
          ))}
          </div>
          <div className="container2  text-center">
            <div className="row text-center">
              <div className=" text-center">
                <h1>{data.city && data.city.name ? data.city.name : ""}</h1>
              </div>
              <div className="location">
                <h2>
                  {data.list &&
                    data.list.length > 0 &&
                    data.list[0]?.dt_txt &&
                    getDay(data.list[0].dt_txt)}
                </h2>
                {data.list &&
                  data.list.length > 0 &&
                  data.list[0]?.dt_txt &&
                  data.list[0].dt_txt.split(" ")[0]}
              </div>
              <div className="temp">
                <h3>
                  {Math.round(
                    data.list &&
                      data.list.length > 0 &&
                      data.list[0]?.main?.temp &&
                      (data.list[1].main.temp - 273.15).toFixed()
                  ) || 0}
                  °C
                </h3>
              </div>
              <div className="main">
                <div className="main">
                  {data.list &&
                    data.list.length > 0 &&
                    data.list[0]?.weather &&
                    data.list[0]?.weather[0]?.icon && (
                      <img
                        src={`/images/${data.list[0]?.weather[0]?.icon}.svg`}
                        alt="sun"
                      />
                  )}
                </div>
              </div>


              <div className="main">
                <div className="main main2">
                  {data.list &&
                    data.list[0]?.weather &&
                    data.list[0]?.weather[0]?.main &&
                    data.list[0].weather[0].main}
                </div>
              </div>
            </div>

            <div className=" top2 bg-dark text-white ">
              {days.map((day) => (
                <Card className="">
                  <Card.Body  className="bg-dark text-white top3">
                    <Card.Title>{getDay(day.date)}</Card.Title>
                    <Card.Text>{(day.temp - 273.15).toFixed()}°C</Card.Text>
                    <Card.Text>
                    <img
                              src={(`./images/${day.icon}.svg`)}
                              alt='sun'
                            />
                    </Card.Text>
                    <Card.Text>{day.weather_desc}</Card.Text>
                  </Card.Body>
                </Card>
              ))}
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

export default App;
