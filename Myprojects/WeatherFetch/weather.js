const button = document.querySelector('button');
const input = document.querySelector('input'); //why not #input? 
const result = document.querySelector('#result');
const weatherResult = document.querySelector('#weatherResult');




//making a function which works when enter key is pressed while typing in input box

input.addEventListener('keypress', clickfunction);
//why we use input.addEventListener? because we want to listen for the keypress event on the input element,
//  so we use input.addEventListener to add an event listener to the input element.

function clickfunction(event) {
    //event.key is means which key was pressed, and if it is "Enter", then we will run the getWeather function.


    if (event.key ==="Enter")
        console.log("enter key was presed");
    
    return getweather(); //
    //return is used to stop the function from running any further
};

// how 






//getting value of city from input box and returning it from the function getweather


async function getweather(){

    //
    //
    const city = input.value // .value works because cityInput is an input element, and .value gets the text inside the input box
    //abcInput wont work because we didnt define abcInput, we defined cityInput, so we have to use cityInput.value to get the text from the input box




  const apiKey = "b2e5942bf5174a9fb7c104548262405"

  // API website URL
  //  When we call this URL, the API will return the weather data for that city in JSON format, which we can then use to display the weather information on our webpage.
  const url =
    `https://api.weatherapi.com/v1/current.json?key=${apiKey}&q=${city}`
 
    

    //now we have the URL, 
    // we can use fetch to get the data from the API. 
    // fetch is a built-in function in JavaScript that allows us to make HTTP requests to a server and get a response back.


    const response = await fetch(url)
    const data = await response.json()
//why await? because fetch is an asynchronous function, which means it takes some time to get the response from the server.
// By using await, we can wait for the response to come back before we try to use the data.



    //now we have the data from the API, we can use it to display the weather information on our webpage.
    // for example, we can get the temperature from the data and display it in the weatherResult element.


    //how do we know how to get the temperature from the data? we can look at the API documentation to see the structure of the data that is returned.
//how to look at the API documentation? we can go to the API website and look for the documentation,
// which will show us how the data is structured and what information is available.
    



const temperature = data.current.temp_c
    weatherResult.innerHTML = `The temperature in ${city} is ${temperature}°C`

    //now we have data , we just need to display it using innerHTML to show the temperature in the weatherResult element.

}