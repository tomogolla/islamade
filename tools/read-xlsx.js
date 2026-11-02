/* ==========================================================================
   Tiny .xlsx reader — no installs needed, just Node.
   --------------------------------------------------------------------------
   An .xlsx file is a zip of XML files. This unzips it with Node's built-in
   zlib and reads each sheet into rows of cell values.

   readWorkbook(path) → { "Sheet name": [ [cell, cell, …], … ], … }
   Each cell is { value, formula } where formula is true when the cell holds
   a formula (value is null if Excel didn't save a result for it).
   ========================================================================== */

const fs = require("fs");
const zlib = require("zlib");

/* Unzips the file into a { "path/in/zip": Buffer } map */
function unzip(buffer) {
  // The "end of central directory" record sits at the end of the file
  let eocd = buffer.length - 22;
  while (eocd >= 0 && buffer.readUInt32LE(eocd) !== 0x06054b50) eocd--;
  if (eocd < 0) throw new Error("Not a valid .xlsx (zip) file");

  const count = buffer.readUInt16LE(eocd + 10);
  let pointer = buffer.readUInt32LE(eocd + 16);
  const files = {};

  for (let i = 0; i < count; i++) {
    const method = buffer.readUInt16LE(pointer + 10);
    const compressedSize = buffer.readUInt32LE(pointer + 20);
    const nameLength = buffer.readUInt16LE(pointer + 28);
    const extraLength = buffer.readUInt16LE(pointer + 30);
    const commentLength = buffer.readUInt16LE(pointer + 32);
    const localOffset = buffer.readUInt32LE(pointer + 42);
    const name = buffer.toString("utf8", pointer + 46, pointer + 46 + nameLength);

    const localNameLength = buffer.readUInt16LE(localOffset + 26);
    const localExtraLength = buffer.readUInt16LE(localOffset + 28);
    const start = localOffset + 30 + localNameLength + localExtraLength;
    const data = buffer.subarray(start, start + compressedSize);
    files[name] = method === 8 ? zlib.inflateRawSync(data) : data;

    pointer += 46 + nameLength + extraLength + commentLength;
  }
  return files;
}

function decodeXML(text) {
  return text
    .replace(/&lt;/g, "<")
    .replace(/&gt;/g, ">")
    .replace(/&quot;/g, '"')
    .replace(/&apos;/g, "'")
    .replace(/&#(\d+);/g, (_, n) => String.fromCodePoint(Number(n)))
    .replace(/&#x([0-9a-f]+);/gi, (_, n) => String.fromCodePoint(parseInt(n, 16)))
    .replace(/&amp;/g, "&");
}

/* All the text inside <t> tags (a cell's text can be split into styled runs) */
function textOf(xml) {
  return [...xml.matchAll(/<t(?:\s[^>]*)?>([\s\S]*?)<\/t>/g)].map((m) => decodeXML(m[1])).join("");
}

/* "C" → 2, "AA" → 26 */
function columnIndex(letters) {
  return [...letters].reduce((n, ch) => n * 26 + ch.charCodeAt(0) - 64, 0) - 1;
}

function readWorkbook(path) {
  const files = unzip(fs.readFileSync(path));
  const read = (name) => (files[name] ? files[name].toString("utf8") : "");

  const sharedStrings = [...read("xl/sharedStrings.xml").matchAll(/<si>([\s\S]*?)<\/si>/g)].map((m) => textOf(m[1]));

  // Sheet name → file inside the zip
  const rels = {};
  for (const m of read("xl/_rels/workbook.xml.rels").matchAll(/<Relationship\b[^>]*>/g)) {
    const id = m[0].match(/Id="([^"]+)"/)[1];
    const target = m[0].match(/Target="([^"]+)"/)[1];
    rels[id] = target.startsWith("/") ? target.slice(1) : `xl/${target}`;
  }

  const sheets = {};
  for (const m of read("xl/workbook.xml").matchAll(/<sheet\b[^>]*>/g)) {
    const name = decodeXML(m[0].match(/name="([^"]+)"/)[1]);
    const relId = m[0].match(/r:id="([^"]+)"/)[1];
    sheets[name] = readSheet(read(rels[relId]), sharedStrings);
  }
  return sheets;
}

function readSheet(xml, sharedStrings) {
  const rows = [];
  for (const rowMatch of xml.matchAll(/<row\b([^>]*?)(?:\/>|>([\s\S]*?)<\/row>)/g)) {
    const rowNumber = Number(rowMatch[1].match(/\br="(\d+)"/)[1]);
    const cells = [];
    for (const c of (rowMatch[2] || "").matchAll(/<c\b([^>]*?)(?:\/>|>([\s\S]*?)<\/c>)/g)) {
      const attrs = c[1];
      const inner = c[2] || "";
      const ref = attrs.match(/\br="([A-Z]+)\d+"/)[1];
      const type = (attrs.match(/\bt="([^"]+)"/) || [])[1];
      const formula = /<f\b/.test(inner);
      const raw = (inner.match(/<v>([\s\S]*?)<\/v>/) || [])[1];

      let value = null;
      if (type === "s" && raw !== undefined) value = sharedStrings[Number(raw)];
      else if (type === "inlineStr") value = textOf(inner);
      else if (type === "b" && raw !== undefined) value = raw === "1";
      else if (raw !== undefined) value = type === "str" || type === "e" ? decodeXML(raw) : Number(raw);

      cells[columnIndex(ref)] = { value, formula };
    }
    rows[rowNumber - 1] = cells;
  }
  return rows;
}

module.exports = { readWorkbook };
