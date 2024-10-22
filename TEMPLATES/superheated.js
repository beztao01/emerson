// Variables globales para almacenar los valores actuales de temperatura y presión
let currentTemp = null;
let currentTempUnit = null;
let currentPressure = null;
let currentPressureUnit = null;

// Función para convertir unidades de temperatura y presión
function convertUnits(value, fromUnit, targetUnit) {
    fromUnit = fromUnit.toLowerCase();
    targetUnit = targetUnit.toLowerCase();

    if (fromUnit === targetUnit) {
        return value;
    }

    // Convertir presión
    const pressureConversions = {
        kpa: 1,
        mpa: 1000,
        psi: 6.89476,
        bar: 100,
        'kg/cm²': 98.0665,
        mmhg: 0.133322
    };

    if (fromUnit in pressureConversions) {
        value *= pressureConversions[fromUnit];
        if (targetUnit in pressureConversions) {
            return value / pressureConversions[targetUnit];
        }
    }

    // Convertir temperatura
    if (fromUnit === 'c') {
        if (targetUnit === 'f') {
            return (value * 9 / 5) + 32;
        } else if (targetUnit === 'k') {
            return value + 273.15;
        }
    } else if (fromUnit === 'f') {
        value = (value - 32) * 5 / 9;
        if (targetUnit === 'c') {
            return value;
        } else if (targetUnit === 'k') {
            return value + 273.15;
        }
    } else if (fromUnit === 'k') {
        if (targetUnit === 'c') {
            return value - 273.15;
        } else if (targetUnit === 'f') {
            return (value - 273.15) * 9 / 5 + 32;
        }
    }

    return null;  // Return null if conversion is not possible
}

// Simulación de cálculos de propiedades
function calculateProperties(temp, pressure, tempUnit, pressureUnit) {
    const tempK = convertUnits(temp, tempUnit, 'K');  // Convertir la temperatura a Kelvin
    const pressureKPa = convertUnits(pressure, pressureUnit, 'kPa');  // Convertir la presión a kPa

    if (tempK < 273.15 || tempK > 647.096) {
        throw new Error("Temperature must be between 0°C and 374°C (273.15 K and 647.096 K).");
    }

    if (pressureKPa <= 0) {
        throw new Error("Pressure must be positive.");
    }

    // Simulación de resultados (los valores son aproximados)
    return {
        temp: tempK,
        v: (1 / (pressureKPa * 0.1)).toFixed(4),  // Volumen específico simulado
        h: (2500 + (tempK - 273.15) * 10).toFixed(2),  // Entalpía específica simulada
        Specific_Heat: (4.18).toFixed(2),  // Calor específico simulado
        viscosity: (0.001 * (1 + (tempK - 273.15) * 0.02)).toFixed(4)  // Viscosidad simulada
    };
}

// Función para mostrar los resultados en la página
function displayResults(results, tempUnit) {
    document.getElementById('temp_result').textContent = convertUnits(results.temp, 'K', tempUnit).toFixed(2);
    document.getElementById('temp_unit_result').textContent = tempUnit;
    document.getElementById('volume').textContent = results.v;

    // Mostrar los resultados de entalpía, calor específico y viscosidad
    document.getElementById('enthalpy').textContent = results.h + ' kJ/kg';
    document.getElementById('specific_heat').textContent = results.Specific_Heat + ' kJ/kg·K';
    document.getElementById('viscosity').textContent = results.viscosity + ' mPa·s';

    // Ocultar mensaje de error si ya estaba visible
    hideError();
}

// Función para mostrar un mensaje de error
function showError(message) {
    const errorElement = document.getElementById('error_message');
    errorElement.textContent = message;
    errorElement.style.display = 'block';  // Mostrar el mensaje de error
}

// Función para ocultar el mensaje de error
function hideError() {
    const errorElement = document.getElementById('error_message');
    errorElement.style.display = 'none';  // Ocultar el mensaje de error
}

// Función para actualizar los valores actuales sin mostrar resultados todavía
function updateValues() {
    currentTemp = parseFloat(document.getElementById('temperature').value);
    currentTempUnit = document.getElementById('temp_unit').value;
    currentPressure = parseFloat(document.getElementById('pressure').value);
    currentPressureUnit = document.getElementById('pressure_unit').value;

    // Asegurar que no se utilicen valores no válidos
    if (isNaN(currentTemp)) {
        currentTemp = null;
    }
    if (isNaN(currentPressure)) {
        currentPressure = null;
    }
}

// Función para ejecutar los cálculos y mostrar los resultados cuando se presione "Calculate"
function calculateAndDisplay() {
    updateValues(); // Actualizamos los valores justo antes de hacer los cálculos

    if (isNaN(currentTemp) || isNaN(currentPressure) || !currentTempUnit || !currentPressureUnit) {
        showError("Please enter valid temperature, pressure, and units.");
        return;
    }

    try {
        const results = calculateProperties(currentTemp, currentPressure, currentTempUnit, currentPressureUnit);
        displayResults(results, currentTempUnit);  // Mostrar los resultados en la página
    } catch (error) {
        showError(error.message);  // Mostrar el error si ocurre
    }
}

// Registrar eventos 'input' y 'change' en los inputs y selects para actualizar los valores en segundo plano
document.getElementById('temperature').addEventListener('input', updateValues);
document.getElementById('temp_unit').addEventListener('change', updateValues);
document.getElementById('pressure').addEventListener('input', updateValues);  // Vinculación de presión
document.getElementById('pressure_unit').addEventListener('change', updateValues);  // Vinculación de unidad de presión

// Manejo del botón "Calculate"
document.getElementById('propertyForm').addEventListener('submit', function (e) {
    e.preventDefault();  // Evitar el envío del formulario
    calculateAndDisplay();  // Ejecutar los cálculos y mostrar los resultados
});

// Función para limpiar el formulario y los resultados
function clearForm() {
    document.getElementById('temperature').value = '';
    document.getElementById('temp_unit').value = '';
    document.getElementById('pressure').value = '';
    document.getElementById('pressure_unit').value = '';
    
    // Limpiar los resultados
    document.getElementById('temp_result').textContent = '-';
    document.getElementById('temp_unit_result').textContent = '';
    document.getElementById('volume').textContent = '-';
    document.getElementById('enthalpy').textContent = '-';
    document.getElementById('specific_heat').textContent = '-';
    document.getElementById('viscosity').textContent = '-';

    // Ocultar cualquier mensaje de error
    hideError();

    // Resetear los valores almacenados
    currentTemp = null;
    currentTempUnit = null;
    currentPressure = null;
    currentPressureUnit = null;
}

// Asignar el botón "Clean" para limpiar el formulario
document.getElementById('cleanBtn').addEventListener('click', clearForm);
