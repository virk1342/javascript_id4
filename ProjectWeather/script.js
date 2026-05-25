// ==============================
// GET HTML ELEMENTS
// ==============================

// Get the input box
const cityInput = document.getElementById("cityInput")

// Get the button
const searchBtn = document.getElementById("searchBtn")

// Get the result div
const weatherResult = document.getElementById("weatherResult")











// ==============================
// ADD CLICK EVENT
// ==============================

// When user clicks button,
// run getWeather function
searchBtn.addEventListener("click", getWeather)



// ==============================
// ADD ENTER KEY EVENT
// ==============================
//key press means when user presses a key on keyboard while typing in input box
// Listen for keyboard typing
cityInput.addEventListener("keypress", function(event) {

  // Check if Enter key was pressed

  //explain more about event.key === "Enter"
  //event is the object that contains information about the key press event, like which key was pressed, etc.
  //event.key is a property of the event object that gives us the value of the key that was pressed. 
  //So if the user presses the Enter key, event.key will be equal to "Enter". 
  //This condition checks if the key that was pressed is the Enter key, and if it is, it will run the getWeather function.
  if (event.key === "Enter") {

    // Run weather function
    getWeather()
  } 
})










// ==============================
// MAIN WEATHER FUNCTION
// ==============================
//using async will only make it faster if we have to wait for something, like an API request
//we can do it without using async, but then we would have to use .then() to wait for the API response, which can be more complicated
// async means this function can wait
// for things like API requests
async function getWeather() {

  // Get text from input box
  const city = cityInput.value

  // If input is empty
  if (city === "") {

    // Show message
    weatherResult.innerHTML = "Please enter a city"

    // Stop function
    return
  }
//why using return here? because if we don't return, the function will continue 
// running and try to fetch weather data with an empty city, which will cause an error.
//  By returning, we stop the function from running any further if the input is empty.
  

// Your API key goes here
  const apiKey = "b2e5942bf5174a9fb7c104548262405"

  // API website URL
  //why link
  const url =
    `https://api.weatherapi.com/v1/current.json?key=${apiKey}&q=${city}`



  // try means:
  // "try this code"


  //try and catch are used for error handling. 
  //They allow us to run code that might cause an error, a
  // nd if an error does happen, we can catch it and handle it gracefully instead of crashing the program.
  
  //try means "try to run this code, but if there is an error, don't crash the program, just go to the catch part"

  
  try {

    // Show loading message
    weatherResult.innerHTML = "Loading..."


    // fetch sends request to API
    // await waits until data comes back
    const response = await fetch(url)



    // If city is wrong
    if (!response.ok) {

      // Create error
      throw new Error("City not found")
    }



    // Convert response into JSON
    const data = await response.json()



    // Get city name from API
    const cityName = data.location.name

    // Get country name
    const country = data.location.country

    // Get temperature
    const temperature = data.current.temp_c

    // Get weather condition
    const condition = data.current.condition.text

    // Get weather icon
    const icon = data.current.condition.icon



    // Put weather data on screen
    weatherResult.innerHTML = `
    
      <h2>${cityName}, ${country}</h2>

      <img src="${icon}">

      <p>Temperature: ${temperature}°C</p>

      <p>Condition: ${condition}</p>
    
    `

  } 
  
  
  
  // catch runs if error happens
  catch (error) {

    // Show error message
    weatherResult.innerHTML = error.message

    // Show error in console
    console.log(error)
  }
}