# Sistema de Evaluación de Alternativas Económicas (SEAE) - VPN


Sistema web para evaluar alternativas económicas mediante el método del Valor Presente Neto (VPN).

## Integrantes del equipo

- Iván Eduardo López Tobar - LT22009


## Características principales

- 🚀 Cálculo del Valor Presente Neto (VPN) para dos proyectos alternativos
- 📊 Comparación detallada entre ambas alternativas
- 📄 Generación de reportes en formato TXT
- 🌈 Interfaz intuitiva y responsive
- 📱 Compatible con dispositivos móviles

## Tecnologías utilizadas

- Frontend:
  - HTML5
  - CSS3 (con variables y Flexbox)
  - JavaScript (ES6)

## Instalación y uso

No se requiere instalación. El sistema funciona directamente en el navegador:

1. Clonar el repositorio o descargar los archivos
2. Abrir `index.html` en cualquier navegador moderno
3. Completar los datos de ambos proyectos
4. Hacer clic en "Calcular VPN" para obtener resultados
5. Opcionalmente exportar el reporte con los resultados

## Funcionamiento del sistema

El sistema calcula el VPN usando la fórmula:

VPN = -Inversión Inicial + Σ(Flujo de Caja / (1 + tasa)^n)


Donde:
- Inversión Inicial: Costo inicial del proyecto
- Flujo de Caja: Beneficios netos por período
- tasa: Tasa de descuento
- n: Número de períodos

## Criterios de evaluación

- VPN ≥ 0: Proyecto aceptable
- VPN < 0: Proyecto no recomendable
- Entre dos alternativas: Se selecciona la de mayor VPN


**Universidad De El Salvador**  
*Ingeniería de negocios*  
*2025*