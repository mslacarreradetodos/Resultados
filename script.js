// Manejar cambio en el tipo de búsqueda
document.getElementById('searchType').addEventListener('change', function() {
    const searchType = this.value;
    const searchValueInput = document.getElementById('searchValue');
    const searchValueLabel = document.getElementById('searchValueLabel');

    if (searchType) {
        searchValueInput.disabled = false;
        searchValueLabel.textContent = searchType === 'documento' ? 'Número de Documento' : 'Número de Atleta';
        searchValueInput.placeholder = searchType === 'documento' ? 'Ingresa el número de documento' : 'Ingresa el número de atleta';
    } else {
        searchValueInput.disabled = true;
        searchValueLabel.textContent = 'Número';
        searchValueInput.placeholder = 'Ingresa el número';
    }
});

// Manejar envío del formulario
document.getElementById('resultsForm').addEventListener('submit', async function(e) {
    e.preventDefault();

    // Obtener valores del formulario
    const searchType = document.getElementById('searchType').value;
    const searchValue = document.getElementById('searchValue').value;

    // Validar entrada
    if (!searchType || !searchValue) {
        alert('Por favor, selecciona un tipo de búsqueda e ingresa un número.');
        return;
    }

    try {
        // Cargar el archivo carrera.json
        const response = await fetch('carrera.json');
        if (!response.ok) {
            throw new Error('Error al cargar el archivo JSON');
        }
        const data = await response.json();

        // Filtrar los datos según los criterios de búsqueda
        const resultados = data.filter(result => {
            return searchType === 'documento'
                ? result.documento === searchValue
                : result.numero === searchValue;
        });

        // Mostrar resultados
        const resultsTable = document.getElementById('resultsTable');
        const resultsBody = document.getElementById('resultsBody');
        const noResults = document.getElementById('noResults');
        resultsBody.innerHTML = '';

        if (resultados.length > 0) {
            resultsTable.classList.remove('d-none');
            noResults.classList.add('d-none');
            resultados.forEach(result => {
                const row = document.createElement('tr');
                row.innerHTML = `
                    <td>${result.nombre}</td>
                    <td>${result.posicion}</td>
                    <td>${result.tiempo}</td>
                    <td>${result.distancia}</td>
                    <td>${result.categoria}</td>
                `;
                resultsBody.appendChild(row);
            });
        } else {
            resultsTable.classList.add('d-none');
            noResults.classList.remove('d-none');
        }

        // Desplazarse a la sección de resultados
        document.getElementById('results').scrollIntoView({ behavior: 'smooth' });
    } catch (error) {
        console.error('Error:', error);
        alert('Hubo un error al procesar la solicitud. Intenta de nuevo.');
        // Desplazarse a la sección de resultados incluso si hay un error
        document.getElementById('results').scrollIntoView({ behavior: 'smooth' });
    }
});