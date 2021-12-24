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
    console.log("button pressed");
    const searchfor = inputEL.val();
    console.log(searchfor);
    filldata(searchfor)
});
const getdata = async() => {
    console.log("step1 ");
    const response = await fetch(
        "https://api.openweathermap.org/data/2.5/weather?q=Sydney&appid=2f3f656925a35903ae2c9a034877c0b1"
    );
    if (response.status === 200) {
        console.log("step 2");
        const data = await response.json();

        console.log("step 3");
        return data;
    }
};

const get5days = async(long, lat) => {
    if (long && lat) {
        console.log(`getting data for ${long}  ${lat}`);
        const response = await fetch(
            `https://api.openweathermap.org/data/2.5/onecall?lat=${long}&lon=${lat}&exclude=current,minutely,hourly,alerts&units=metric&appid=${API_key}`,

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
        console.log(`found ${city} in localstorage will send ${localdata}`);
        return localdata;
    } else {
        console.log("Getting from network");
        const response = await fetch(
            `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=2f3f656925a35903ae2c9a034877c0b1`, { cache: "force-cache" }
        );
        if (response.status === 200) {
            const data = await response.json();
            if (data) {
                console.log(`typeof ${typeof data} valueof ${data} }  `);

                for (const [key, value] of Object.entries(data)) {
                    console.log(`key: ${key} value:${value}`);
                    if (key == "coord") {
                        localStorage.setItem(city, JSON.stringify(value));
                        return value;
                    }
                    // if (typeof(value) === 'object') {
                    //     console.log(`${key}  is an object`)
                    //     console.log(Object.entries(value))

                    // }
                    // console.log(key, value)
                }
            }
        }
    }
};
// write2dom = (data) => {
//   if (data) {
//     console.log("DOM", data);
//   }
// };
let cardEL = "";
const startEL = $("#Start");

const createcard = (mtdt, temp, wind_speed, humidity) => {
    cardEL = `<div class="col flex-wrap">
    <div class="card mycard ">
        <div   class="card-body =">
            <h6 class="card-title">${mtdt}</h6>
            <span  class="d-block fs-5"> 
            ICON
            </span>
            <span class="d-block">
            Temp: ${temp}°C
            </span>
            <span class="d-block">
            Wind: ${wind_speed} kmpH
            </span>
            <span class="d-block">
            Humidity: ${humidity} %
            </span>


        </div>
    </div>
</div>`;

    startEL.append(cardEL);
};
const write2cards = (data) => {
    if (data) {
        console.log("write2cards", data);
        for (let day = 0; day < 5; day++) {
            const mydt = new Date(data[day].dt * 1000).toDateString();
            const { temp, uvi, wind_speed, humidity } = data[day];

            console.log("UVI", uvi);

            createcard(mydt, temp.day, wind_speed, humidity);
        }
    }
};

const getonce = async(lon, lat, city) => {
    console.log("RUNNING GETONCE ......");
    if (lat && lon) {
        console.log(`getting data for ${lon}  ${lat}`);
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
// btn2EL.on("click", async(e) => {
//     const { lat, lon } = await getcoords("Melbourne");

//     const days5 = await get5days(lat, lon);
//     const singledata = await getonce(lat, lon, "Melbourne");
//     console.log("GIOT SINGLE DATA", singledata)
//     if (singledata) {
//         const temprature = await singledata.current.temp;
//         const UVI = singledata.current.uvi;
//         const windspeed = singledata.wind_speed;
//         const humidity = singledata.current.humidity;
//         const singledate = new Date(singledata.current.dt * 1000)
//             .toLocaleString()
//             .substring(1, 10);

//         dateEL.html(`<h2 class="d-inline"> (${singledate})</h2>`);
//         tempEL.html(`<h6 class="mt-3"> Temp:${temprature} C </h6>`);
//         windEL.html(`<h6> Wind:${singledata.current.wind_speed} Kmph </h6>`);
//         humidityEL.html(`<h6> Humidity:${singledata.current.humidity} % </h6>`);
//         singledata.current.uvi < 3 ?
//             (uvclass = "bg-success") :
//             (uvclass = "bg-danger");
//         uvEL.html(
//             `<h6 class="${uvclass} text-light" > UV index:${singledata.current.uvi} </h6>`
//         );
//     } else {
//         console.log("Failed to get SINGLEDATA line 150 ")
//     }

//     write2cards(days5.daily);
// });

const filldata = async(city) => {
    const { lat, lon } = await getcoords(city);
    console.log(lat, lon);
    const days5 = await get5days(lat, lon);
    const singledata = await getonce(lat, lon);
    console.log("Got data from getonce func ", singledata)
    const temprature = await singledata.current.temp;
    const UVI = singledata.current.uvi;
    const windspeed = singledata.wind_speed;
    const humidity = singledata.current.humidity;
    const singledate = new Date(singledata.current.dt * 1000)
        .toLocaleString()
        .substring(1, 10);

    dateEL.html(`<h2 class="d-inline"> (${singledate})</h2>`);
    console.log(" dateEL", dateEL)
    cityEL.html(`<h2 class="d-inline">${city}</h6>`);
    tempEL.html(`<h6 class="mt-3"> Temp:${temprature} C </h6>`);
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
// fetch("https://api.openweathermap.org/data/2.5/weather?q=Sydney&appid=2f3f656925a35903ae2c9a034877c0b1")
//     .then(response => response.json())
//     .then(data => console.log(data))
//     .catch(err => console.log(err))

// fetch("https://api.openweathermap.org/data/2.5/weather?q=Sydney&appid=2f3f656925a35903ae2c9a034877c0b1")
//     .then((response) => {
//         if (response.status === 200) {
//             return response.json()
//         }
//     })
//     .then((data) => { console.log(data) })

// const mydata = getdata()
// console.log("step 4")
// console.log(mydata)

// (async() => {

//     mydata = await getdata();
//     //[base, clouds, , coordinates, , main, namee, ] = mydata
//     // for (const [key, value] of(Object.entries(mydata))) {
//     //     console.log(`${key}: ${value}`)
//     // }
//     // const [lat, lon] = getcoords()
//     // console.log(`longtitute: ${lon} latitite:${lat}`)
//     const { lat, lon } = getcoords()
//     console.log(`longtitute: ${lon} latitite:${lat}`)

// })()

// let getcoords = () => {
//     if (mydata) {
//         for (const [key, value] of(Object.entries(mydata))) {
//             if (key === "coord") {
//                 return value
//             }
//             //console.log(`${key}: ${value}`)
//         }

//     } else {
//         console.log("no mydata")
//     }

// }

// const myarr = ["onething", "twothing", "something"]
// const [one, two, three] = myarr
// console.log(three)