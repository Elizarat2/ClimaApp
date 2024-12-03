const API_URL = "https://api.open-meteo.com/v1/forecast"; // URL de la API de Open-Meteo
const GEOCODE_API_URL = "https://api.opencagedata.com/geocode/v1/json";
const GEOCODE_API_KEY = "d1434d2e9d1646dbafed76f21606007e"; // Tu clave de API para geocoding

// Obtener elementos del DOM
const searchButton = document.getElementById('searchButton');
const cityInput = document.getElementById('city');
const weatherResult = document.getElementById('weather-result');

// Función para obtener las coordenadas de la ciudad usando la API de OpenCage
async function getCoordinates(city) {
    try {
        const response = await fetch(`${GEOCODE_API_URL}?q=${city}&key=${GEOCODE_API_KEY}&language=es`);
        const data = await response.json();

        if (data.results.length === 0) {
            throw new Error("Ciudad no encontrada. Intenta de nuevo.");
        }

        // Mostrar las coordenadas en la consola para depuración
        console.log(`Coordenadas obtenidas: ${data.results[0].geometry.lat}, ${data.results[0].geometry.lng}`);

        const { lat, lng } = data.results[0].geometry;
        const cityName = data.results[0].components.city || "Desconocida";  // Extraemos el nombre de la ciudad
        const countryName = data.results[0].components.country || "Desconocido";  // Extraemos el nombre del país

        // Actualizar la interfaz con la ciudad y país correctos
        document.getElementById('cityCountry').innerText = `${cityName}, ${countryName}`;

        return { lat, lng };
    } catch (error) {
        throw new Error(error.message);
    }
}

// Función para obtener el pronóstico del clima para la ciudad y mostrar la información
async function getWeather(lat, lng, city) {
    try {
        const response = await fetch(`${API_URL}?latitude=${lat}&longitude=${lng}&daily=temperature_2m_max&timezone=America/Mexico_City`);
        const data = await response.json();

        if (!data.daily) {
            throw new Error("No se pudo obtener el pronóstico. Intenta de nuevo.");
        }

        // Asignar las temperaturas máximas a los elementos correspondientes en el DOM
        document.getElementById('forecast_temp_tue').innerText = `${data.daily.temperature_2m_max[0]}°C`;
        document.getElementById('forecast_temp_wed').innerText = `${data.daily.temperature_2m_max[1]}°C`;
        document.getElementById('forecast_temp_thu').innerText = `${data.daily.temperature_2m_max[2]}°C`;
        document.getElementById('forecast_temp_fri').innerText = `${data.daily.temperature_2m_max[3]}°C`;

        // Mostrar el nombre de la ciudad y país en el DOM
        document.getElementById('cityCountry').innerText = `${city}`;

        // Mostrar el resultado
        weatherResult.style.display = 'block';
    } catch (error) {
        weatherResult.innerHTML = `<p>${error.message}</p>`;
        weatherResult.style.display = 'block';
    }
}

// Event listener para el botón "Cambiar Ubicación"
searchButton.addEventListener('click', async () => {
    const city = cityInput.value.trim();

    if (city) {
        try {
            const { lat, lng } = await getCoordinates(city);
            await getWeather(lat, lng, city);  // Llamamos a la función para obtener el clima de la nueva ciudad
        } catch (error) {
            weatherResult.innerHTML = `<p>${error.message}</p>`;
            weatherResult.style.display = 'block';
        }
    } else {
        weatherResult.innerHTML = '<p>Por favor ingresa el nombre de una ciudad.</p>';
        weatherResult.style.display = 'block';
    }
});


