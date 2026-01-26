interface GeneratePrintWindowOptions {
  images: string[];
  headerId: string;
  metricsId: string;
}

/**
 * Genera una ventana de impresión optimizada con las imágenes capturadas
 * Evita cortes de gráficas entre páginas usando page-break-inside: avoid
 */
export function generatePrintWindow({ 
  images, 
  headerId, 
  metricsId 
}: GeneratePrintWindowOptions): void {
  const printWindow = window.open('', '_blank', 'width=1000,height=800');
  
  if (!printWindow) {
    alert('No se pudo abrir la ventana de impresión. Por favor, permite las ventanas emergentes.');
    return;
  }

  // Obtener el contenido del header y LIMPIARLO
  const headerElement = document.getElementById(headerId);
  let headerHTML = '';
  
  if (headerElement) {
    // Clonar el elemento para no modificar el original
    const headerClone = headerElement.cloneNode(true) as HTMLElement;
    
    // Remover elementos que NO queremos en la impresión
    const elementsToRemove = headerClone.querySelectorAll(
      '.print\\:hidden, .print-hidden, .no-print, button, .stats-grid, .stat-card, [class*="grid-cols"]'
    );
    
    elementsToRemove.forEach(el => el.remove());
    
    // Extraer solo título y descripción
    const title = headerClone.querySelector('h1')?.textContent || '';
    const description = headerClone.querySelector('p')?.textContent || '';
    
    // Generar HTML limpio solo con título y descripción
    headerHTML = `
      <div id="metric-header" style="padding: 20px; margin-bottom: 20px;">
        <h1 style="font-size: 24px; font-weight: 700; color: #111827; margin-bottom: 8px;">
          ${title}
        </h1>
        ${description ? `<p style="font-size: 14px; color: #6B7280;">${description}</p>` : ''}
      </div>
    `;
  }

  // Obtener todas las tarjetas de preguntas con sus datos
  const metricCards = document.querySelectorAll('[data-metric-index]');
  
  // Generar HTML para cada pregunta con su gráfica
  const chartsHTML = Array.from(metricCards)
    .map((card, index) => {
      const img = images[index];
      if (!img || img.length <= 200) return '';

      // Extraer información de la pregunta
      const questionTitle = card.querySelector('h3')?.textContent || `Pregunta ${index + 1}`;
      const totalResponsesElement = card.querySelector('.text-xs.text-gray-500 span');
      const totalResponses = totalResponsesElement?.textContent || '0';
      
      // Extraer las opciones con sus valores
      const options = Array.from(card.querySelectorAll('.space-y-2\\.5 > div, .space-y-2 > div'))
        .map(option => {
          const label = option.querySelector('.text-gray-700, .truncate')?.textContent?.trim() || '';
          const percentage = option.querySelector('.text-xs.text-gray-500')?.textContent?.trim() || '';
          const count = option.querySelector('.font-semibold')?.textContent?.trim() || '';
          return { label, percentage, count };
        })
        .filter(opt => opt.label); // Filtrar opciones vacías

      const optionsHTML = options
        .map(opt => `
          <div class="option-row">
            <div class="option-label">
              <span class="option-dot"></span>
              <span>${opt.label}</span>
            </div>
            <div class="option-values">
              <span class="percentage">${opt.percentage}</span>
              <span class="count">${opt.count}</span>
            </div>
          </div>
        `)
        .join('');

      return `
        <div class="chart-page">
          <div class="question-section">
            <h2 class="question-title">${questionTitle}</h2>
            <p class="total-responses">Total de respuestas: <strong>${totalResponses}</strong></p>
            <div class="options-list">
              ${optionsHTML}
            </div>
          </div>
          <div class="chart-container">
            <img src="${img}" alt="${questionTitle}" class="chart-image" />
          </div>
        </div>
      `;
    })
    .filter(Boolean)
    .join('\n');

  const printContent = `
    <!DOCTYPE html>
    <html lang="es">
      <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Reporte de Métricas</title>
        <style>
          /* Reset básico */
          * {
            margin: 0;
            padding: 0;
            box-sizing: border-box;
          }

          html, body {
            width: 100%;
            height: 100%;
          }

          body {
            font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif;
            padding: 0;
            background: white;
            color: #111827;
            line-height: 1.5;
          }

          /* Header styles */
          #metric-header {
            padding: 20px;
            margin-bottom: 20px;
          }

          #metric-header h1 {
            font-size: 24px;
            font-weight: 700;
            color: #111827;
            margin-bottom: 8px;
          }

          #metric-header p {
            font-size: 14px;
            color: #6B7280;
          }

          /* Container para cada pregunta + gráfica */
          .chart-page {
            /* CLAVE: Evitar que se corte entre páginas */
            page-break-inside: avoid;
            break-inside: avoid;
            
            /* Forzar nueva página antes si es necesario */
            page-break-before: auto;
            break-before: auto;
            
            /* Siempre salto de página después */
            page-break-after: always;
            break-after: always;
            
            padding: 20px;
            margin-bottom: 20px;
            background: white;
            position: relative;
          }

          /* Última gráfica no necesita salto de página */
          .chart-page:last-child {
            page-break-after: avoid;
            break-after: avoid;
          }

          /* Sección de la pregunta */
          .question-section {
            margin-bottom: 16px;
            padding: 16px;
            background: #F9FAFB;
            border-radius: 10px;
            border: 1px solid #E5E7EB;
            
            /* Evitar que la sección se corte */
            page-break-inside: avoid;
            break-inside: avoid;
          }

          .question-title {
            font-size: 16px;
            font-weight: 600;
            color: #111827;
            margin-bottom: 6px;
            line-height: 1.4;
          }

          .total-responses {
            font-size: 12px;
            color: #6B7280;
            margin-bottom: 12px;
          }

          .total-responses strong {
            color: #374151;
            font-weight: 600;
          }

          /* Lista de opciones */
          .options-list {
            display: flex;
            flex-direction: column;
            gap: 6px;
          }

          .option-row {
            display: flex;
            justify-content: space-between;
            align-items: center;
            padding: 8px 10px;
            background: white;
            border: 1px solid #E5E7EB;
            border-radius: 6px;
            font-size: 12px;
          }

          .option-label {
            display: flex;
            align-items: center;
            gap: 8px;
            flex: 1;
            min-width: 0;
          }

          .option-dot {
            width: 8px;
            height: 8px;
            border-radius: 50%;
            background: linear-gradient(135deg, #3B82F6, #2563EB);
            flex-shrink: 0;
          }

          .option-label span {
            color: #374151;
            font-weight: 500;
            white-space: nowrap;
            overflow: hidden;
            text-overflow: ellipsis;
          }

          .option-values {
            display: flex;
            align-items: center;
            gap: 10px;
            margin-left: 10px;
            flex-shrink: 0;
          }

          .percentage {
            color: #6B7280;
            font-size: 11px;
          }

          .count {
            color: #111827;
            font-weight: 600;
            min-width: 28px;
            text-align: right;
          }

          /* Container de la gráfica */
          .chart-container {
            /* CLAVE: Evitar que la imagen se corte */
            page-break-inside: avoid;
            break-inside: avoid;
            
            display: flex;
            justify-content: center;
            align-items: center;
            padding: 16px;
            background: white;
            border: 1px solid #E5E7EB;
            border-radius: 10px;
            min-height: 300px;
            max-height: 500px;
          }

          .chart-image {
            /* CLAVE: Evitar que la imagen se corte */
            page-break-inside: avoid;
            break-inside: avoid;
            
            max-width: 100%;
            max-height: 450px;
            width: auto;
            height: auto;
            display: block;
            margin: 0 auto;
          }

          /* Estilos específicos para impresión */
          @media print {
            body {
              padding: 0;
              margin: 0;
            }

            /* Ocultar elementos no imprimibles */
            .no-print,
            .print-hidden,
            .print\\:hidden,
            button,
            .stats-grid,
            .stat-card {
              display: none !important;
              visibility: hidden !important;
              height: 0 !important;
              overflow: hidden !important;
            }

            /* Configuración de página */
            .chart-page {
              page-break-inside: avoid !important;
              break-inside: avoid !important;
              page-break-after: always !important;
              break-after: always !important;
              padding: 15mm;
              margin: 0;
            }

            .chart-page:last-child {
              page-break-after: avoid !important;
              break-after: avoid !important;
            }

            /* Asegurar que imágenes no se corten */
            .chart-container {
              page-break-inside: avoid !important;
              break-inside: avoid !important;
              max-height: 60vh;
              overflow: hidden;
            }

            .chart-image {
              page-break-inside: avoid !important;
              break-inside: avoid !important;
              max-height: 55vh;
              object-fit: contain;
            }

            /* Optimizar espacio */
            .question-section {
              page-break-inside: avoid !important;
              break-inside: avoid !important;
            }

            /* Header en primera página solamente */
            #metric-header {
              page-break-after: avoid;
              padding: 10mm;
            }
          }

          /* Configuración de página A4 */
          @page {
            size: A4 portrait;
            margin: 15mm 10mm;
          }

          /* Primera página con header */
          @page :first {
            margin-top: 15mm;
          }
        </style>
      </head>
      <body>
        ${headerHTML}
        <div class="charts-section">
          ${chartsHTML}
        </div>
        <script>
          // Esperar a que las imágenes carguen antes de imprimir
          window.onload = function() {
            const images = document.querySelectorAll('.chart-image');
            let loadedImages = 0;
            
            if (images.length === 0) {
              setTimeout(() => {
                window.print();
              }, 500);
              return;
            }

            // Contar imágenes cargadas
            images.forEach(img => {
              if (img.complete) {
                loadedImages++;
              } else {
                img.addEventListener('load', () => {
                  loadedImages++;
                  if (loadedImages === images.length) {
                    setTimeout(() => {
                      window.print();
                    }, 300);
                  }
                });
              }
            });

            // Si todas ya estaban cargadas
            if (loadedImages === images.length) {
              setTimeout(() => {
                window.print();
              }, 300);
            }

            // Timeout de seguridad (10 segundos)
            setTimeout(() => {
              if (loadedImages < images.length) {
                console.warn('Algunas imágenes no se cargaron completamente');
                window.print();
              }
            }, 10000);
          };

          // Cerrar ventana después de imprimir (opcional)
          window.onafterprint = function() {
            setTimeout(() => {
              window.close();
            }, 500);
          };
        </script>
      </body>
    </html>
  `;

  printWindow.document.write(printContent);
  printWindow.document.close();
}
