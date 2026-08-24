// Genera PROYECTO_DANILO_ARAMAYO.docx en formato APA 7ma edicion
// (Times New Roman 12, interlineado 1,5) a partir de los capitulos Markdown.
import fs from 'fs';
import {
  Document, Packer, Paragraph, TextRun, HeadingLevel, AlignmentType,
  Table, TableRow, TableCell, WidthType, BorderStyle, ImageRun, Header,
  PageNumber, TableOfContents, SimpleField, ExternalHyperlink, VerticalAlign,
  PageBreak,
} from 'docx';

const TNR = 'Times New Roman';
const LINE = 360;          // interlineado 1,5 (240 = simple)
const SANGRIA = 720;       // 1,27 cm en twips

const FIG_TITULOS = [
  ['Diagrama entidad-relación de la base de datos optica_db', 'img/fig1_er_base_datos.png'],
  ['Flujo de navegación del sistema según el rol del usuario', 'img/fig2_flujo_navegacion.png'],
  ['Arquitectura en capas implementada en la solución', 'img/fig3_arquitectura_capas.png'],
  ['Secuencia de autenticación JWT con control de acceso por roles', 'img/fig4_secuencia_jwt.png'],
  ['Pirámide de pruebas aplicada al proyecto', 'img/fig5_piramide_pruebas.png'],
  ['Arquitectura de despliegue con Docker Compose', 'img/fig6_despliegue_docker.png'],
  ['Canalización conceptual de despliegue del prototipo', 'img/fig7_pipeline.png'],
];
const TABLA_TITULOS = [
  'Matriz de consistencia técnica y metodológica del proyecto',
  'Estructura de la tabla roles',
  'Estructura de la tabla usuarios',
  'Estructura de la tabla clientes',
  'Estructura de la tabla recetas',
  'Estructura de la tabla productos',
  'Estructura de la tabla ventas',
  'Estructura de la tabla detalle_venta',
  'Estructura de la tabla orden_trabajo',
  'Estructura de la tabla recibos',
  'Contrato general de la API REST',
  'Mapa de endpoints del sistema',
  'Pantallas del sistema y su contenido principal',
  'Validación de datos en cuatro niveles',
  'Servicios definidos en Docker Compose',
  'Variables de entorno del despliegue',
  'URLs del sistema desplegado',
  'Suites de pruebas unitarias ejecutadas',
  'Casos de prueba funcionales: autenticación y usuarios',
  'Casos de prueba funcionales: clientes y recetas',
  'Casos de prueba funcionales: inventario y ventas',
  'Casos de prueba funcionales: órdenes de trabajo y reportes',
  'Evaluación de los objetivos específicos frente al prototipo',
];

let contadorTablas = 0;
let contadorFigs = 0;

// ---------- runs inline (negrita / cursiva / codigo) ----------
const INLINE = /(\*\*.+?\*\*|\*[^*]+?\*|`[^`]+`)/g;

function runsMd(texto, extra = {}) {
  const out = [];
  for (const trozo of texto.split(INLINE)) {
    if (!trozo) continue;
    if (trozo.startsWith('**') && trozo.endsWith('**'))
      out.push(new TextRun({ text: trozo.slice(2, -2), bold: true, ...extra }));
    else if (trozo.length > 2 && trozo.startsWith('*') && trozo.endsWith('*'))
      out.push(new TextRun({ text: trozo.slice(1, -1), italics: true, ...extra }));
    else if (trozo.startsWith('`') && trozo.endsWith('`'))
      out.push(new TextRun({ text: trozo.slice(1, -1), font: 'Courier New', size: 22, ...extra }));
    else
      out.push(new TextRun({ text: trozo, ...extra }));
  }
  return out;
}

const pBody = (children, opts = {}) => new Paragraph({
  children,
  spacing: { line: opts.line ?? LINE, before: opts.before ?? 0, after: opts.after ?? 0 },
  alignment: opts.align,
  indent: opts.indent,
});

const cuerpo = (texto) => pBody(runsMd(texto), { indent: { firstLine: SANGRIA } });

function citaBloque(texto) {
  let t = texto.trim();
  if (!(t.startsWith('"') || t.startsWith('«'))) t = `"${t}"`;
  return pBody(runsMd(t), { indent: { left: SANGRIA }, after: 120 });
}

const vineta = (texto) => pBody(runsMd(texto), {
  bullet: { level: 0 },
});

function heading(texto, nivel) {
  const mapa = { 1: HeadingLevel.HEADING_1, 2: HeadingLevel.HEADING_2, 3: HeadingLevel.HEADING_3 };
  return new Paragraph({
    text: texto.replace(/\*\*/g, ''),
    heading: mapa[Math.min(nivel, 3)],
    spacing: { line: LINE, before: nivel === 1 ? 240 : 160, after: nivel === 1 ? 120 : 80 },
    alignment: nivel === 1 ? AlignmentType.CENTER : AlignmentType.LEFT,
  });
}

function bloqueCodigo(lineas) {
  const pars = lineas.map((ln, idx) => pBody(
    [new TextRun({ text: ln || ' ', font: 'Courier New', size: 20 })],
    { line: 240, indent: { left: SANGRIA }, after: idx === lineas.length - 1 ? 160 : 0 },
  ));
  return pars;
}

// ---------- tablas APA ----------
const sinBorde = { style: BorderStyle.NONE, size: 0, color: 'FFFFFF' };
const bordeFino = { style: BorderStyle.SINGLE, size: 6, color: '000000' };

function celda(texto, esHeader = false) {
  return new TableCell({
    verticalAlign: VerticalAlign.CENTER,
    borders: esHeader
      ? { top: sinBorde, bottom: bordeFino, left: sinBorde, right: sinBorde }
      : { top: sinBorde, bottom: sinBorde, left: sinBorde, right: sinBorde },
    children: [pBody(
      runsMd(String(texto).replace(/<br\s*\/?>/g, ' '), {
        size: 22, bold: esHeader,
      }),
      { line: 240, after: 40, align: esHeader ? AlignmentType.CENTER : undefined },
    )],
  });
}

function tablaApa(headers, filas, nota = null) {
  const titulo = TABLA_TITULOS[contadorTablas];
  contadorTablas += 1;
  const salida = [];
  salida.push(pBody([
    new TextRun({ text: 'Tabla ', bold: true }),
    new SimpleField(`SEQ Tabla \\* ARABIC`, String(contadorTablas)),
  ], { before: 200, after: 40 }));
  salida.push(pBody([new TextRun({ text: titulo, italics: true })], { after: 80 }));

  const encabezado = new TableRow({
    tableHeader: true,
    children: headers.map((h) => celda(h.replace(/\*\*/g, ''), true)),
  });
  const cuerpoT = filas.map((f) => new TableRow({
    children: headers.map((_, j) => celda(f[j] ?? '')),
  }));
  salida.push(new Table({
    width: { size: 100, type: WidthType.PERCENTAGE },
    alignment: AlignmentType.CENTER,
    borders: {
      top: bordeFino, bottom: bordeFino,
      left: sinBorde, right: sinBorde, insideHorizontal: sinBorde, insideVertical: sinBorde,
    },
    rows: [encabezado, ...cuerpoT],
  }));

  if (nota) {
    salida.push(pBody([
      new TextRun({ text: 'Nota. ', italics: true, size: 22 }),
      ...runsMd(nota, { size: 22 }),
    ], { before: 60, after: 200, line: 240 }));
  } else {
    salida.push(new Paragraph({ spacing: { after: 160 }, children: [] }));
  }
  return salida;
}

function figuraApa(idx) {
  const [titulo, ruta] = FIG_TITULOS[idx - 1];
  const buf = fs.readFileSync(ruta);
  // dimensiones PNG desde el IHDR
  const wPx = buf.readUInt32BE(16);
  const hPx = buf.readUInt32BE(20);
  const wOut = 585;                       // ~15,4 cm a 96 dpi
  const hOut = Math.round(wOut * hPx / wPx);

  const salida = [];
  salida.push(pBody([
    new TextRun({ text: 'Figura ', bold: true }),
    new SimpleField(`SEQ Figura \\* ARABIC`, String(contadorFigs)),
  ], { before: 200, after: 40 }));
  salida.push(pBody([new TextRun({ text: titulo, italics: true })], { after: 80 }));
  salida.push(new Paragraph({
    alignment: AlignmentType.CENTER,
    spacing: { after: 200 },
    children: [new ImageRun({ type: 'png', data: buf, transformation: { width: wOut, height: hOut } })],
  }));
  return salida;
}

// ---------- parser markdown ----------
function parseMd(path, docChildren) {
  const lineas = fs.readFileSync(path, 'utf-8').split('\n');
  let i = 0;
  while (i < lineas.length) {
    const ln = lineas[i].replace(/\s+$/, '');
    if (ln.startsWith('```')) {
      const lang = ln.slice(3).trim().toLowerCase();
      const bloque = [];
      i += 1;
      while (i < lineas.length && !lineas[i].startsWith('```')) { bloque.push(lineas[i]); i += 1; }
      if (lang === 'mermaid') {
        contadorFigs += 1;
        docChildren.push(...figuraApa(contadorFigs));
      } else {
        docChildren.push(...bloqueCodigo(bloque));
      }
    } else if (ln.trimStart().startsWith('|')) {
      const filasMd = [];
      while (i < lineas.length && lineas[i].trimStart().startsWith('|')) { filasMd.push(lineas[i].trim()); i += 1; }
      const limpias = filasMd.filter((f) => !/^\|[\s:\-|]+\|$/.test(f))
        .map((f) => f.replace(/^\||\|$/g, '').split('|').map((c) => c.trim()));
      if (limpias.length) docChildren.push(...tablaApa(limpias[0], limpias.slice(1)));
      continue;
    } else if (/^#{1,4}\s/.test(ln)) {
      const m = ln.match(/^(#{1,4})\s+(.*)$/);
      docChildren.push(heading(m[2].trim(), m[1].length));
    } else if (ln.startsWith('> ')) {
      docChildren.push(citaBloque(ln.slice(2)));
    } else if (ln.trimStart().startsWith('- ')) {
      docChildren.push(vineta(ln.trim().slice(2).trim()));
    } else if (/^\d+\.\s+/.test(ln)) {
      docChildren.push(cuerpo(ln));
    } else if (ln.trim().startsWith('\\*')) {
      docChildren.push(pBody([
        new TextRun({ text: 'Nota. ', italics: true, size: 22 }),
        ...runsMd(ln.replace(/^\\\*\s*/, ''), { size: 22 }),
      ], { before: 60, after: 200, line: 240 }));
    } else if (ln.trim() && ln.trim() !== '.') {
      docChildren.push(cuerpo(ln.trim()));
    }
    i += 1;
  }
}

// ---------- construccion ----------
const children = [];

// PORTADA
const centro = (t, opts = {}) => new Paragraph({
  alignment: AlignmentType.CENTER,
  spacing: { line: LINE, before: opts.antes ?? 0 },
  children: [new TextRun({ text: t, bold: opts.bold, size: opts.size ?? 26, font: TNR })],
});
const vacio = () => new Paragraph({ children: [], spacing: { line: LINE } });

children.push(centro('UNIVERSIDAD UNIOR', { bold: true, size: 34, antes: 600 }));
children.push(centro('INGENIERÍA DE SISTEMAS', { bold: true, size: 28, antes: 240 }));
for (let k = 0; k < 5; k++) children.push(vacio());
children.push(centro('"SISTEMA DE INFORMACIÓN WEB FULL STACK PARA LA GESTIÓN INTEGRAL DE LA ÓPTICA VICTORIA"', { bold: true, size: 28 }));
for (let k = 0; k < 4; k++) children.push(vacio());
children.push(centro('Estudiante: Aramayo Garisto Danilo', { size: 26 }));
children.push(vacio());
children.push(centro('Oruro – Bolivia', { size: 26 }));
children.push(centro('2026', { size: 26 }));
children.push(new Paragraph({ children: [new PageBreak()] }));

function indice(titulo, instr, placeholder) {
  children.push(heading(titulo, 1));
  children.push(new Paragraph({
    spacing: { line: LINE },
    children: [new SimpleField(instr, placeholder)],
  }));
  children.push(pBody([
    new TextRun({
      text: '(Al abrir el documento: seleccione este índice, clic derecho → Actualizar campos, o presione F9.)',
      italics: true, size: 20,
    }),
  ], { before: 120, line: 240 }));
}

indice('Índice General', 'TOC \\o "1-3" \\h \\z \\u', 'Índice general — presione F9');
children.push(new Paragraph({ children: [new PageBreak()] }));
indice('Índice de Tablas', 'TOC \\h \\z \\c "Tabla"', 'Relación de tablas — presione F9');
children.push(new Paragraph({ children: [new PageBreak()] }));
indice('Índice de Figuras', 'TOC \\h \\z \\c "Figura"', 'Relación de figuras — presione F9');
children.push(new Paragraph({ children: [new PageBreak()] }));

// RESUMEN
children.push(heading('Resumen', 1));
for (const lnRaw of fs.readFileSync('00-resumen.md', 'utf-8').split('\n')) {
  const ln = lnRaw.replace(/\s+$/, '');
  if (!ln || ln.startsWith('#')) continue;
  if (ln.startsWith('**Palabras clave:**')) {
    children.push(pBody([
      new TextRun({ text: 'Palabras clave: ', bold: true, italics: true }),
      ...runsMd(ln.replace('**Palabras clave:**', '').trim()),
    ], { before: 160 }));
  } else {
    children.push(pBody(runsMd(ln), { after: 120 }));
  }
}
children.push(new Paragraph({ children: [new PageBreak()] }));

// CAPITULOS
for (const cap of ['01-introduccion.md', '02-marco-teorico.md', '03-metodologia.md',
  '04-modelado-diseno.md', '05-implementacion.md', '06-conclusiones.md']) {
  parseMd(cap, children);
  children.push(new Paragraph({ children: [new PageBreak()] }));
}

// REFERENCIAS (APA: sangria francesa, orden alfabetico)
children.push(heading('Referencias', 1));
const refs = [
  ['Arjonilla, R. (s.f.). ¿Qué es Backend? ', 'Rafarjonilla. ', 'https://rafarjonilla.com/que-es/backend/'],
  ['EBAC. (17 de julio de 2023). Qué es React y para qué sirve. ', 'EBAC Blog. ', 'https://ebac.mx/blog/que-es-react'],
  ['Flores, J. L. (4 de septiembre de 2019). Qué es NodeJS y para qué sirve. ', 'OpenWebinars. ', 'https://openwebinars.net/blog/que-es-nodejs/'],
  ['IONOS. (6 de julio de 2024). ¿Qué es el frontend? ', 'IONOS Digital Guide. ', 'https://www.ionos.es/digitalguide/paginas-web/creacion-de-paginas-web/que-es-el-frontend/'],
  ['Maceda, H. C. (2015). ', 'Arquitectura de software.', null],
  ['Mixpanel Team. (6 de diciembre de 2024). What is a tech stack? ', 'Mixpanel Blog. ', 'https://mixpanel.com/blog/what-is-a-technology-stack/'],
];
for (const [autor, resto, url] of refs) {
  const runs = [new TextRun({ text: autor }), ...(url ? [new TextRun({ text: `${resto}` })] : [])];
  if (!url) runs.push(new TextRun({ text: resto.replace(/\.$/, '.'), italics: true }));
  if (url) runs.push(new ExternalHyperlink({
    children: [new TextRun({ text: url, style: 'Hyperlink' })],
    link: url,
  }));
  children.push(pBody(runs, { indent: { left: SANGRIA, hanging: SANGRIA }, after: 120 }));
}

const doc = new Document({
  styles: {
    default: {
      document: {
        run: { font: TNR, size: 24, color: '000000' },
        paragraph: { spacing: { line: LINE } },
      },
      heading1: {
        run: { font: TNR, size: 24, bold: true, color: '000000' },
        paragraph: { spacing: { line: LINE, before: 240, after: 120 }, alignment: AlignmentType.CENTER },
      },
      heading2: {
        run: { font: TNR, size: 24, bold: true, color: '000000' },
        paragraph: { spacing: { line: LINE, before: 160, after: 80 } },
      },
      heading3: {
        run: { font: TNR, size: 24, bold: true, italics: true, color: '000000' },
        paragraph: { spacing: { line: LINE, before: 160, after: 80 } },
      },
    },
  },
  sections: [{
    properties: {
      page: {
        margin: { top: 1440, bottom: 1440, left: 1440, right: 1440 },   // 2,54 cm
      },
    },
    headers: {
      default: new Header({
        children: [new Paragraph({
          alignment: AlignmentType.RIGHT,
          children: [new TextRun({ children: [PageNumber.CURRENT], font: TNR, size: 24 })],
        })],
      }),
    },
    children,
  }],
});

const buffer = await Packer.toBuffer(doc);
fs.writeFileSync('../PROYECTO_DANILO_ARAMAYO.docx', buffer);
console.log(`OK -> ../PROYECTO_DANILO_ARAMAYO.docx | Tablas: ${contadorTablas} | Figuras: ${contadorFigs}`);
