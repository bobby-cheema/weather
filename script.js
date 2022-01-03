const API_key = "2f3f656925a35903ae2c9a034877c0b1";
let mydata;
const inputEL = $("#input-city");
const searchbtnEL = $("#search-btn");
const btn1EL = $("#btn1");
const btn2EL = $("#btn2");

const btn3EL = $("#btn3");
const btn4EL = $("#btn4");
const btn5EL = $("#btn5");

const cityEL = $("#displaycity");
const dateEL = $("#displaydate");
const iconEL = $("#displayicon");
const tempEL = $("#displaytemp");
const windEL = $("#displaywind");
const humidityEL = $("#displayhumidity");
const uvEL = $("#displayUV");

searchbtnEL.on("click", (e) => {
    e.preventDefault();

    const searchfor = inputEL.val();

    filldata(searchfor);
});
const getdata = async() => {
    const response = await fetch(
        "https://api.openweathermap.org/data/2.5/weather?q=Sydney&appid=2f3f656925a35903ae2c9a034877c0b1"
    );
    if (response.status === 200) {
        const data = await response.json();

        return data;
    }
};

const get5days = async(long, lat) => {
    if (long && lat) {
        const response = await fetch(
            `https://api.openweathermap.org/data/2.5/onecall?lat=${long}&lon=${lat}&exclude=current,minutely,hourly,alerts&units=metric&appid=${API_key}`
        );
        if (response.status === 200) {
            const data = await response.json();
            if (data) {
                return data;
            }
        }
    }
};
const getcoords = async(city) => {
    const localdata = JSON.parse(localStorage.getItem(city));
    if (localdata) {
        return localdata;
    } else {
        const response = await fetch(
            `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=2f3f656925a35903ae2c9a034877c0b1`, { cache: "force-cache" }
        );
        if (response.status === 200) {
            const data = await response.json();
            if (data) {
                for (const [key, value] of Object.entries(data)) {
                    if (key == "coord") {
                        localStorage.setItem(city, JSON.stringify(value));
                        return value;
                    }
                }
            }
        }
    }
};

let cardEL = "";
const startEL = $("#Start");

const createcard = (mtdt, temp, wind_speed, humidity, cardicon) => {
    const mycardsrc = `http://openweathermap.org/img/wn/${cardicon}@2x.png`;
    cardEL = `<div class="col flex-wrap cardclass">
    <div class="card mycard ">
        <div   class="card-body p-0">
            <h6 class="card-title p-1">${mtdt}</h6>
            <span  class="d-block "> 
            <img src="${mycardsrc}" alt="weather icon"  height="50px" width="50px"></img>
            </span>
            <span class="d-block mb-1">
            Temp: ${temp}°C
            </span>
            <span class="d-block mb-1">
            Wind: ${wind_speed} kmpH
            </span>
            <span class="d-block mb-1">
            Humidity: ${humidity} %
            </span>


        </div>
    </div>
</div>`;

    startEL.append(cardEL);
};
const write2cards = (data) => {
    $(".cardclass").remove();
    if (data) {
        for (let day = 1; day < 6; day++) {
            const mydt = new Date(data[day].dt * 1000).toDateString();
            const { temp, uvi, wind_speed, humidity, weather } = data[day];
            const cardicon = weather[0].icon;

            createcard(mydt, temp.day, wind_speed, humidity, cardicon);
        }
    }
};

const getonce = async(lon, lat, city) => {
    if (lat && lon) {
        const response = await fetch(
            `https://api.openweathermap.org/data/2.5/onecall?lat=${lon}&lon=${lat}&exclude=daily,minutely,hourly,alerts&units=metric&appid=${API_key}`, {}
        );
        if (response.status === 200) {
            const data = await response.json();
            if (data) {
                return data;
            }
        }
    }
};

btn1EL.on("click", async(e) => {
    filldata("Sydney");
});
btn2EL.on("click", async(e) => {
    filldata("Melbourne");
});
btn3EL.on("click", async(e) => {
    filldata("Adelaide");
});
btn4EL.on("click", async(e) => {
    filldata("Brisbane");
});
btn5EL.on("click", async(e) => {
    filldata("Perth");
});

const filldata = async(city) => {
    const { lat, lon } = await getcoords(city);

    const days5 = await get5days(lat, lon);
    const singledata = await getonce(lat, lon);

    const temprature = await singledata.current.temp;
    const UVI = singledata.current.uvi;
    const windspeed = singledata.wind_speed;
    const humidity = singledata.current.humidity;
    const myicon = singledata.current.weather[0].icon;

    const singledate = new Date(singledata.current.dt * 1000)
        .toLocaleString()
        .substring(0, 10);

    dateEL.html(`<h2 class="d-inline"> (${singledate})</h2>`);

    cityEL.html(`<h2 class="d-inline mb-0">${city}</h6>`);
    tempEL.html(`<h6 class="mt-3"> Temp:${temprature} C </h6>`);
    const mysrc = `https://openweathermap.org/img/wn/${myicon}@2x.png`;
    iconEL.html(
        `<img src="${mysrc}" alt="weather icon"  height="50px" width="50px"></img`
    );
    windEL.html(`<h6> Wind:${singledata.current.wind_speed} Kmph </h6>`);
    humidityEL.html(`<h6> Humidity:${singledata.current.humidity} % </h6>`);
    singledata.current.uvi < 3 ?
        (uvclass = "bg-success") :
        (uvclass = "bg-danger");
    uvEL.html(
        `<h6 class="${uvclass} text-light" > UV index:${singledata.current.uvi} </h6>`
    );

    write2cards(days5.daily);
};