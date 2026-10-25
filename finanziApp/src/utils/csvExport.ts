import type { Transaccion } from "../types/database";

export const exportTransactionsToCSV = (transacciones: Transaccion[]): void => {
  const headers = ['Fecha', 'Categoría', 'Descripción', 'Monto'];
  const rows = transacciones.map((t) => [
    t.fecha,
    t.categoria?.nombre || 'Sin categoría',
    `"${t.descripcion || ''}"`,
    t.monto,
  ]);

  const csvContent =
    'data:text/csv;charset=utf-8,\uFEFF' +
    [headers.join(','), ...rows.map((e) => e.join(','))].join('\n');

  const encodedUri = encodeURI(csvContent);
  const link = document.createElement('a');
  link.setAttribute('href', encodedUri);
  link.setAttribute('download', `finanzi_reporte_${new Date().toISOString().slice(0, 10)}.csv`);
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
};