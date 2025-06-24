document.addEventListener('DOMContentLoaded', function() {
    // Elementos del DOM
    const project1Years = document.getElementById('years1');
    const project2Years = document.getElementById('years2');
    const cashFlows1 = document.getElementById('cashFlows1');
    const cashFlows2 = document.getElementById('cashFlows2');
    const calculateBtn = document.getElementById('calculateBtn');
    const exportBtn = document.getElementById('exportBtn');
    const clearBtn = document.getElementById('clearBtn');
    const resultsContent = document.getElementById('resultsContent');

    // Generar campos de flujo de caja cuando cambia el número de años
    project1Years.addEventListener('change', function() {
        generateCashFlowInputs(cashFlows1, this.value, '1');
    });

    project2Years.addEventListener('change', function() {
        generateCashFlowInputs(cashFlows2, this.value, '2');
    });

    // Calcular VPN al hacer clic en el botón
    calculateBtn.addEventListener('click', calculateVPN);

    // Exportar reporte
    exportBtn.addEventListener('click', exportReport);

    // Limpiar formulario
    clearBtn.addEventListener('click', clearForm);

    // Función para generar campos de flujo de caja
    function generateCashFlowInputs(container, years, projectNum) {
        container.innerHTML = '';
        const yearsCount = parseInt(years) || 0;
        
        for (let i = 1; i <= yearsCount; i++) {
            const div = document.createElement('div');
            div.className = 'form-group cash-flow-item';
            
            const label = document.createElement('label');
            label.textContent = `Flujo año ${i} ($):`;
            label.htmlFor = `cashFlow${projectNum}_${i}`;
            
            const input = document.createElement('input');
            input.type = 'number';
            input.id = `cashFlow${projectNum}_${i}`;
            input.step = 'any';
            input.required = true;
            input.placeholder = 'Ingrese el flujo de caja';
            
            div.appendChild(label);
            div.appendChild(input);
            container.appendChild(div);
        }
    }

    // Función para calcular el VPN
    function calculateVPN() {
        // Obtener datos del Proyecto A
        const initialCost1 = parseFloat(document.getElementById('initialCost1').value);
        const discountRate1 = parseFloat(document.getElementById('discountRate1').value) / 100;
        const years1 = parseInt(document.getElementById('years1').value);
        
        const cashFlowsArray1 = [];
        for (let i = 1; i <= years1; i++) {
            const cashFlow = parseFloat(document.getElementById(`cashFlow1_${i}`).value) || 0;
            cashFlowsArray1.push(cashFlow);
        }

        // Obtener datos del Proyecto B
        const initialCost2 = parseFloat(document.getElementById('initialCost2').value);
        const discountRate2 = parseFloat(document.getElementById('discountRate2').value) / 100;
        const years2 = parseInt(document.getElementById('years2').value);
        
        const cashFlowsArray2 = [];
        for (let i = 1; i <= years2; i++) {
            const cashFlow = parseFloat(document.getElementById(`cashFlow2_${i}`).value) || 0;
            cashFlowsArray2.push(cashFlow);
        }

        // Calcular VPN para ambos proyectos
        const vpn1 = calculateNPV(initialCost1, discountRate1, cashFlowsArray1);
        const vpn2 = calculateNPV(initialCost2, discountRate2, cashFlowsArray2);

        // Mostrar resultados
        displayResults(vpn1, vpn2);
    }

    // Función para calcular el Valor Presente Neto
    function calculateNPV(initialCost, discountRate, cashFlows) {
        let npv = -initialCost; // Incluir el costo inicial como flujo negativo
        
        for (let i = 0; i < cashFlows.length; i++) {
            const period = i + 1;
            npv += cashFlows[i] / Math.pow(1 + discountRate, period);
        }
        
        return npv;
    }

    // Función para mostrar los resultados
    function displayResults(vpn1, vpn2) {
        resultsContent.innerHTML = '';
        
        // Resultado Proyecto A
        const result1 = document.createElement('div');
        result1.className = 'result-item';
        result1.innerHTML = `<strong>Proyecto A:</strong> VPN = $${vpn1.toFixed(2)}`;
        if (vpn1 >= 0) {
            result1.classList.add('vpn-positive');
            result1.innerHTML += ' (Proyecto aceptable)';
        } else {
            result1.classList.add('vpn-negative');
            result1.innerHTML += ' (Proyecto no recomendable)';
        }
        resultsContent.appendChild(result1);
        
        // Resultado Proyecto B
        const result2 = document.createElement('div');
        result2.className = 'result-item';
        result2.innerHTML = `<strong>Proyecto B:</strong> VPN = $${vpn2.toFixed(2)}`;
        if (vpn2 >= 0) {
            result2.classList.add('vpn-positive');
            result2.innerHTML += ' (Proyecto aceptable)';
        } else {
            result2.classList.add('vpn-negative');
            result2.innerHTML += ' (Proyecto no recomendable)';
        }
        resultsContent.appendChild(result2);
        
        // Recomendación
        const recommendation = document.createElement('div');
        recommendation.className = 'recommendation';
        
        if (vpn1 >= 0 || vpn2 >= 0) {
            if (vpn1 > vpn2) {
                recommendation.textContent = 'RECOMENDACIÓN: Seleccionar Proyecto A (mayor VPN)';
            } else if (vpn2 > vpn1) {
                recommendation.textContent = 'RECOMENDACIÓN: Seleccionar Proyecto B (mayor VPN)';
            } else {
                recommendation.textContent = 'AMBOS PROYECTOS TIENEN EL MISMO VPN';
            }
        } else {
            recommendation.textContent = 'NINGÚN PROYECTO ES RECOMENDABLE (ambos tienen VPN negativo)';
        }
        
        resultsContent.appendChild(recommendation);
    }

    // Función para exportar el reporte
    function exportReport() {
        const results = resultsContent.textContent;
        if (!results) {
            alert('No hay resultados para exportar. Calcule primero el VPN.');
            return;
        }
        
        // Crear contenido del reporte
        const reportContent = `Sistema de Evaluación de Alternativas Económicas (SEAE)
Fecha: ${new Date().toLocaleString()}
Método: Valor Presente Neto (VPN)

${results}

-- Fin del reporte --
`;

        // Crear archivo y descargar
        const blob = new Blob([reportContent], { type: 'text/plain' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `reporte-vpn-${new Date().toISOString().slice(0,10)}.txt`;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);
    }

    // Función para limpiar el formulario
    function clearForm() {
        document.querySelectorAll('input').forEach(input => {
            input.value = '';
        });
        
        cashFlows1.innerHTML = '';
        cashFlows2.innerHTML = '';
        resultsContent.innerHTML = '';
    }
});