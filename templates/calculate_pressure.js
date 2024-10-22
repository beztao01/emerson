// Función para convertir las unidades de presión
function convertPressure(value, fromUnit) {
    const conversionFactors = {
        Pa: 1,
        kPa: 1e3,
        MPa: 1e6,
        bar: 1e5,
        atm: 1.01325e5
    };
    return value * conversionFactors[fromUnit];
}

// Función para calcular propiedades (sólo simulación)
function calculateProperties(pressure, pressure_unit) {
    const pressurePa = convertPressure(pressure, pressure_unit);

    if (pressurePa < 611.657 || pressurePa > 22.064e6) {
        throw new Error("Pressure must be between 611.657 Pa and 22.064 MPa.");
    }

    // Simulamos algunos cálculos de ejemplo
    return {
        temperature: (pressurePa / 1e5 * 100).toFixed(2),  // Ejemplo de cálculo
        latent_heat: (2257 - (pressurePa / 1e6 * 500)).toFixed(2),  // Ejemplo de cálculo
        enthalpy_vapor: (2500 + (pressurePa / 1e5 * 10)).toFixed(2),  // Ejemplo
        enthalpy_water: (420 + (pressurePa / 1e5 * 5)).toFixed(2),  // Ejemplo
        volume_vapor: (0.001 + (pressurePa / 1e5 * 0.0001)).toFixed(6),  // Ejemplo
        volume_water: (0.001 / (pressurePa / 1e5 * 10)).toFixed(6)  // Ejemplo
    };
}

// Manejar el formulario de presión
document.getElementById('pressureForm').addEventListener('submit', function (e) {
    e.preventDefault();  // Evitar que la página se recargue

    const pressure = parseFloat(document.getElementById('pressure').value);
    const pressure_unit = document.getElementById('pressure_unit').value;
    
    if (isNaN(pressure) || !pressure_unit) {
        showError("Please enter a valid pressure and select a unit.");
        return;
    }

    try {
        const results = calculateProperties(pressure, pressure_unit);
        displayResults(results);
    } catch (error) {
        showError(error.message);
    }
});

// Función para mostrar los resultados en la página
function displayResults(results) {
    document.getElementById('temperature').textContent = results.temperature;
    document.getElementById('latent_heat').textContent = results.latent_heat;
    document.getElementById('enthalpy_vapor').textContent = results.enthalpy_vapor;
    document.getElementById('enthalpy_water').textContent = results.enthalpy_water;
    document.getElementById('volume_vapor').textContent = results.volume_vapor;
    document.getElementById('volume_water').textContent = results.volume_water;

    // Ocultar error si está presente
    document.getElementById('error').classList.add('d-none');
}

// Función para mostrar errores
function showError(message) {
    document.getElementById('error-message').textContent = message;
    document.getElementById('error').classList.remove('d-none');
}

// Función para limpiar los campos y resultados
function clearForm() {
    document.getElementById('pressure').value = '';  // Limpiar input de presión
    document.getElementById('pressure_unit').value = '';  // Limpiar selección de unidad de presión
    document.getElementById('temperature').textContent = '';  // Limpiar resultados
    document.getElementById('latent_heat').textContent = '';
    document.getElementById('enthalpy_vapor').textContent = '';
    document.getElementById('enthalpy_water').textContent = '';
    document.getElementById('volume_vapor').textContent = '';
    document.getElementById('volume_water').textContent = '';
    document.getElementById('error').classList.add('d-none');  // Ocultar errores
}

// Asignar la función clearForm al botón de limpiar
document.getElementById('cleanBtn').addEventListener('click', clearForm);
