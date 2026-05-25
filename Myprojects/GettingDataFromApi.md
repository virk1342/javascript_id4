# How to Use API Data in JavaScript

## 1. Fetch data from API

```js
const response = await fetch(url)
```

* `fetch()` sends a request to the API
* `await` waits until the data comes back

---

## 2. Convert response to JSON

```js
const data = await response.json()
```

* APIs usually return JSON data
* `.json()` converts it into a JavaScript object

---

## 3. Access data using dot notation

Example API data:

```js
{
  current: {
    temp_c: 18
  }
}
```

Get temperature:

```js
const temperature = data.current.temp_c
```

Meaning:

* go inside `data`
* then `current`
* then `temp_c`

---

## 4. Show data on webpage

```js
weatherResult.innerHTML = `Temperature: ${temperature}°C`
```

* `innerHTML` puts content inside an HTML element
* `${}` inserts variables into text
* Backticks ` ` are called template literals

---

## Full Example

```js
const response = await fetch(url)

const data = await response.json()

const temperature = data.current.temp_c

weatherResult.innerHTML =
`Temperature: ${temperature}°C`
```
