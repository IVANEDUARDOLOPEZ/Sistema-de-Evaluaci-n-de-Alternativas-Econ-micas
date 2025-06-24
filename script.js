document.addEventListener('DOMContentLoaded', function() {
    // Elementos del DOM
    const evaluationMethod = document.getElementById('evaluationMethod');
    const project1Years = document.getElementById('years1');
    const project2Years = document.getElementById('years2');
    const cashFlows1 = document.getElementById('cashFlows1');
    const cashFlows2 = document.getElementById('cashFlows2');
    const calculateBtn = document.getElementById('calculateBtn');
    const exportBtn = document.getElementById('exportBtn');
    const clearBtn = document.getElementById('clearBtn');
    const resultsContent = document.getElementById('resultsContent');
    const methodExplanation = document.getElementById('methodExplanation');
    const discountRateGroups = document.querySelectorAll('.discount-rate-group');

    // Cambiar método de evaluación
    evaluationMethod.addEventListener('change', function() {
        updateFormForMethod(this.value);
        clearResults();
    });

    // Generar campos de flujo de caja cuando cambia el número de años
    project1Years.addEventListener('change', function() {
        generateCashFlowInputs(cashFlows1, this.value, '1');
    });

    project2Years.addEventListener('change', function() {
        generateCashFlowInputs(cashFlows2, this.value, '2');
    });

    // Calcular al hacer clic en el botón
    calculateBtn.addEventListener('click', calculateFinancials);

    // Exportar reporte
    exportBtn.addEventListener('click', exportReport);

    // Limpiar formulario
    clearBtn.addEventListener('click', clearForm);

    // Actualizar formulario según el método seleccionado
    function updateFormForMethod(method) {
        // Mostrar/ocultar tasa de descuento según el método
        if (method === 'tir') {
            document.body.classList.add('tir-method');
        } else {
            document.body.classList.remove('tir-method');
        }

        // Actualizar explicación del método
        updateMethodExplanation(method);
    }

    // Actualizar la explicación del método
    function updateMethodExplanation(method) {
        let explanation = '';
        let formula = '';
        
        switch(method) {
            case 'vpn':
                explanation = 'El Valor Presente Neto (VPN) es la diferencia entre el valor presente de los flujos de caja futuros y la inversión inicial. Un VPN ≥ 0 indica que el proyecto es económicamente viable.';
                formula = 'Fórmula: VPN = -Inversión Inicial + Σ(Flujo de Caja / (1 + r)^n)';
                break;
            case 'cae':
                explanation = 'El Costo Anual Equivalente (CAE) convierte todos los costos y beneficios del proyecto en un monto anual uniforme. Se usa para comparar proyectos con diferentes vidas útiles. Un CAE positivo indica viabilidad.';
                formula = 'Fórmula: CAE = VPN × [r(1 + r)^n] / [(1 + r)^n - 1]';
                break;
            case 'tir':
                explanation = 'La Tasa Interna de Retorno (TIR) es la tasa de descuento que hace que el VPN sea igual a cero. Un proyecto es aceptable si su TIR es mayor que la tasa de retorno requerida.';
                formula = 'Fórmula: VPN = 0 = -Inversión Inicial + Σ(Flujo de Caja / (1 + TIR)^n)';
                break;
        }

        methodExplanation.innerHTML = `
            <div class="method-explanation">
                <h4>Método: ${evaluationMethod.options[evaluationMethod.selectedIndex].text}</h4>
                <p>${explanation}</p>
                <p><strong>${formula}</strong></p>
            </div>
        `;
    }

    // Generar campos de flujo de caja
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

    // Calcular según el método seleccionado
    function calculateFinancials() {
        const method = evaluationMethod.value;
        
        // Obtener datos del Proyecto A
        const initialCost1 = parseFloat(document.getElementById('initialCost1').value) || 0;
        const discountRate1 = parseFloat(document.getElementById('discountRate1').value) / 100 || 0;
        const years1 = parseInt(document.getElementById('years1').value) || 0;
        
        const cashFlowsArray1 = [];
        for (let i = 1; i <= years1; i++) {
            const cashFlow = parseFloat(document.getElementById(`cashFlow1_${i}`).value) || 0;
            cashFlowsArray1.push(cashFlow);
        }

        // Obtener datos del Proyecto B
        const initialCost2 = parseFloat(document.getElementById('initialCost2').value) || 0;
        const discountRate2 = parseFloat(document.getElementById('discountRate2').value) / 100 || 0;
        const years2 = parseInt(document.getElementById('years2').value) || 0;
        
        const cashFlowsArray2 = [];
        for (let i = 1; i <= years2; i++) {
            const cashFlow = parseFloat(document.getElementById(`cashFlow2_${i}`).value) || 0;
            cashFlowsArray2.push(cashFlow);
        }

        // Validar datos
        if (isNaN(initialCost1) || isNaN(initialCost2) || 
            (method !== 'tir' && (isNaN(discountRate1) || isNaN(discountRate2))) || 
            years1 <= 0 || years2 <= 0) {
            alert('Por favor complete todos los campos requeridos correctamente.');
            return;
        }

        // Calcular según el método seleccionado
        switch(method) {
            case 'vpn':
                const vpn1 = calculateVPN(initialCost1, discountRate1, cashFlowsArray1);
                const vpn2 = calculateVPN(initialCost2, discountRate2, cashFlowsArray2);
                displayVPNResults(vpn1, vpn2, discountRate1, discountRate2);
                break;
            case 'cae':
                const vpnForCAE1 = calculateVPN(initialCost1, discountRate1, cashFlowsArray1);
                const vpnForCAE2 = calculateVPN(initialCost2, discountRate2, cashFlowsArray2);
                const cae1 = calculateCAE(vpnForCAE1, discountRate1, years1);
                const cae2 = calculateCAE(vpnForCAE2, discountRate2, years2);
                displayCAEResults(cae1, cae2);
                break;
            case 'tir':
                const tir1 = calculateTIR(initialCost1, cashFlowsArray1);
                const tir2 = calculateTIR(initialCost2, cashFlowsArray2);
                displayTIRResults(tir1, tir2);
                break;
        }
    }

    // Función para calcular el Valor Presente Neto
    function calculateVPN(initialCost, discountRate, cashFlows) {
        let npv = -initialCost; // Inversión inicial como flujo negativo
        
        for (let i = 0; i < cashFlows.length; i++) {
            const period = i + 1;
            npv += cashFlows[i] / Math.pow(1 + discountRate, period);
        }
        
        return npv;
    }

    // Función para calcular el Costo Anual Equivalente
    function calculateCAE(npv, discountRate, years) {
        if (discountRate === 0) {
            return npv / years;
        }
        const factor = (discountRate * Math.pow(1 + discountRate, years)) / 
                      (Math.pow(1 + discountRate, years) - 1);
        return npv * factor;
    }

    // Función para calcular la Tasa Interna de Retorno (aproximación numérica)
    function calculateTIR(initialCost, cashFlows, maxIterations = 1000, precision = 0.00001) {
        let rate = 0.1; // Tasa inicial de prueba (10%)
        let iteration = 0;
        let npv = 0;
        
        do {
            npv = -initialCost;
            
            for (let i = 0; i < cashFlows.length; i++) {
                npv += cashFlows[i] / Math.pow(1 + rate, i + 1);
            }
            
            // Ajustar la tasa según el resultado
            if (npv > 0) {
                rate += 0.005; // Aumentar tasa si VPN es positivo
            } else {
                rate -= 0.005; // Disminuir tasa si VPN es negativo
            }
            
            iteration++;
            
            // Prevenir bucles infinitos
            if (iteration >= maxIterations) {
                break;
            }
            
        } while (Math.abs(npv) > precision);
        
        return rate;
    }

    // Mostrar resultados para VPN
    function displayVPNResults(vpn1, vpn2, rate1, rate2) {
        resultsContent.innerHTML = '';
        
        // Resultado Proyecto A
        const result1 = document.createElement('div');
        result1.className = `result-item ${vpn1 >= 0 ? 'vpn-positive' : 'vpn-negative'}`;
        result1.innerHTML = `
            <strong>Proyecto A:</strong> VPN = $${vpn1.toFixed(2)} (Tasa: ${(rate1 * 100).toFixed(2)}%)
            <br>${vpn1 >= 0 ? '✅ Proyecto aceptable' : '❌ Proyecto no recomendable'}
        `;
        resultsContent.appendChild(result1);
        
        // Resultado Proyecto B
        const result2 = document.createElement('div');
        result2.className = `result-item ${vpn2 >= 0 ? 'vpn-positive' : 'vpn-negative'}`;
        result2.innerHTML = `
            <strong>Proyecto B:</strong> VPN = $${vpn2.toFixed(2)} (Tasa: ${(rate2 * 100).toFixed(2)}%)
            <br>${vpn2 >= 0 ? '✅ Proyecto aceptable' : '❌ Proyecto no recomendable'}
        `;
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

    // Mostrar resultados para CAE
    function displayCAEResults(cae1, cae2) {
        resultsContent.innerHTML = '';
        
        // Resultado Proyecto A
        const result1 = document.createElement('div');
        result1.className = `result-item ${cae1 >= 0 ? 'cae-positive' : 'cae-negative'}`;
        result1.innerHTML = `
            <strong>Proyecto A:</strong> CAE = $${cae1.toFixed(2)}/año
            <br>${cae1 >= 0 ? '✅ Proyecto aceptable' : '❌ Proyecto no recomendable'}
        `;
        resultsContent.appendChild(result1);
        
        // Resultado Proyecto B
        const result2 = document.createElement('div');
        result2.className = `result-item ${cae2 >= 0 ? 'cae-positive' : 'cae-negative'}`;
        result2.innerHTML = `
            <strong>Proyecto B:</strong> CAE = $${cae2.toFixed(2)}/año
            <br>${cae2 >= 0 ? '✅ Proyecto aceptable' : '❌ Proyecto no recomendable'}
        `;
        resultsContent.appendChild(result2);
        
        // Recomendación
        const recommendation = document.createElement('div');
        recommendation.className = 'recommendation';
        
        if (cae1 >= 0 || cae2 >= 0) {
            if (cae1 > cae2) {
                recommendation.textContent = 'RECOMENDACIÓN: Seleccionar Proyecto B (menor CAE)';
            } else if (cae2 > cae1) {
                recommendation.textContent = 'RECOMENDACIÓN: Seleccionar Proyecto A (menor CAE)';
            } else {
                recommendation.textContent = 'AMBOS PROYECTOS TIENEN EL MISMO CAE';
            }
        } else {
            recommendation.textContent = 'NINGÚN PROYECTO ES RECOMENDABLE (ambos tienen CAE negativo)';
        }
        
        resultsContent.appendChild(recommendation);
    }

    // Mostrar resultados para TIR
    function displayTIRResults(tir1, tir2) {
        resultsContent.innerHTML = '';
        
        // Resultado Proyecto A
        const result1 = document.createElement('div');
        result1.className = 'result-item tir-positive';
        result1.innerHTML = `
            <strong>Proyecto A:</strong> TIR = ${(tir1 * 100).toFixed(2)}%
            <br>${tir1 >= 0 ? '✅ Tasa de retorno positiva' : '⚠️ Tasa de retorno negativa'}
        `;
        resultsContent.appendChild(result1);
        
        // Resultado Proyecto B
        const result2 = document.createElement('div');
        result2.className = 'result-item tir-positive';
        result2.innerHTML = `
            <strong>Proyecto B:</strong> TIR = ${(tir2 * 100).toFixed(2)}%
            <br>${tir2 >= 0 ? '✅ Tasa de retorno positiva' : '⚠️ Tasa de retorno negativa'}
        `;
        resultsContent.appendChild(result2);
        
        // Recomendación
        const recommendation = document.createElement('div');
        recommendation.className = 'recommendation';
        
        if (tir1 > tir2) {
            recommendation.textContent = 'RECOMENDACIÓN: Seleccionar Proyecto A (mayor TIR)';
        } else if (tir2 > tir1) {
            recommendation.textContent = 'RECOMENDACIÓN: Seleccionar Proyecto B (mayor TIR)';
        } else {
            recommendation.textContent = 'AMBOS PROYECTOS TIENEN LA MISMA TIR';
        }
        
        resultsContent.appendChild(recommendation);
    }

    // Exportar reporte
    function exportReport() {
        const results = resultsContent.textContent;
        if (!results) {
            alert('No hay resultados para exportar. Calcule primero los resultados.');
            return;
        }
        
        const methodName = evaluationMethod.options[evaluationMethod.selectedIndex].text;
        
        // Crear contenido del reporte
        const reportContent = `Sistema de Evaluación de Alternativas Económicas (SEAE)
Fecha: ${new Date().toLocaleString()}
Método utilizado: ${methodName}

Integrantes del equipo:
- Iván Eduardo López Tobar - LT22009
- Josué Daniel Rodríguez Yáñez - RY22001
- Christopher Alexis Velásquez Aguilar - VA22020
- Alejandra Michelle Mejía Rivas - MR22035
- Fabio Alexander Leiva Thez - LT22004

RESULTADOS:
${results}

-- Fin del reporte --
`;

        // Crear archivo y descargar
        const blob = new Blob([reportContent], { type: 'text/plain' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `reporte-seae-${methodName.toLowerCase().replace(/ /g, '-')}-${new Date().toISOString().slice(0,10)}.txt`;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);
    }

    // Limpiar resultados
    function clearResults() {
        resultsContent.innerHTML = '';
    }

    // Limpiar formulario
    function clearForm() {
        document.querySelectorAll('input').forEach(input => {
            input.value = '';
        });
        
        cashFlows1.innerHTML = '';
        cashFlows2.innerHTML = '';
        resultsContent.innerHTML = '';
    }

    // Inicializar
    updateFormForMethod(evaluationMethod.value);
});