const API_KEY = '9c54112c07e72b95863bcc33c5d4c305'

// Calculate 1vh value in pixels
// based on window inner height
const vh = window.innerHeight * 0.01

// Set the CSS variable to the root element
// Which is equal to 1vh
document.documentElement.style.setProperty('--vh', vh + 'px')

// -----------------------------------
const $ = selector => document.querySelector(selector)

const container = $('.container')
const search = $('.search-box button')
const weatherBox = $('.weather-box')
const weatherDetails = $('.weather-details')
const error404 = $('.not-found')

search.addEventListener('click', render)

document.addEventListener('keypress', (e) => {
  if (e.key === 'Enter') render()
})

function cleanData (data) {
  const { weather: [weather], main: { temp, pressure, humidity }, visibility, wind: { speed } } = data
  const { main, description, icon } = weather
  return {
    main: main.toLowerCase(),
    description,
    icon,
    temp,
    pressure,
    humidity,
    visibility,
    speed
  }
}

function render () {
  const city = $('.search-box input').value

  if (!city) return

  fetch(`https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${API_KEY}`)
    .then(res => res.json())
    .then(data => {
      if (data.cod === '404') {
        container.style.height = '55rem'

        weatherBox.style.display = 'none'
        weatherDetails.style.display = 'none'

        error404.style.display = 'block'
        error404.classList.add('fadeIn')
        return
      }

      error404.style.display = 'none'
      error404.classList.remove('fadeIn')

      weatherBox.classList.remove('fadeIn')
      weatherDetails.classList.remove('fadeIn')

      const img = $('.weather-box img')
      const temperature = $('.temperature')
      const description = $('.description')
      const humidity = $('.humidity-details .text span')
      const wind = $('.wind-details .text span')
      const pressure = $('.pressure-details .text span')
      const visibility = $('.visibility-details .text span')

      const cleanedData = cleanData(data)

      img.src = `http://openweathermap.org/img/wn/${cleanedData.icon}@4x.png`
      temperature.innerHTML = `${parseInt((cleanedData.temp - 270))}<span>??C</span>`
      description.innerText = cleanedData.description
      humidity.innerText = `${cleanedData.humidity}%`
      wind.innerText = `${parseInt(cleanedData.speed)}km/h`
      pressure.innerText = cleanedData.pressure + 'mb'
      visibility.innerText = `${cleanedData.visibility / 1000}km`

      setTimeout(() => {
        weatherBox.style.display = ''
        weatherDetails.style.display = ''
        weatherBox.classList.add('fadeIn')
        weatherDetails.classList.add('fadeIn')
      }, 100)

      container.style.height = 'min-content'
    })
}
