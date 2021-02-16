import dotenv from "dotenv";
import fs from "fs";
import { spawn } from "child_process";
import xml2js, { ElementCompact } from "xml-js";
import { SVG } from "../types/interfaces";

dotenv.config();

const ICON_PATH = process.env.ICON_PATH || "";

if (!ICON_PATH || !fs.existsSync(ICON_PATH)) {
  console.error("You must provide ICON_PATH env var, see .env-example.");
  process.exit(1);
}

function saveFile(where: string, data: string) {
  fs.writeFileSync(where, data);
  console.log(`Saved svg as: ${where}`);
}

function readSvg(where: string): string {
  return fs.readFileSync(where).toString();
}

async function modifySvg(data: string): Promise<string> {
  const modified: SVG = (xml2js.xml2js(data, {
    compact: true,
  }) as unknown) as SVG;

  const today = new Date();
  const date = today.getDate().toString();
  const month = today.toString().slice(4, 7);

  modified.svg.g.g.text[0]._text = date;
  modified.svg.g.g.text[1]._text = month;

  return xml2js.js2xml((modified as unknown) as ElementCompact, {
    compact: true,
    spaces: 2,
  });
}

function updateCaches() {
  const child = spawn("bash", [
    "-c",
    'update-icon-caches /usr/share/icons/*',
  ]);
  child.on("exit",() => console.log('Cache updated successfully'));
}

async function exec() {
  const svg = readSvg(ICON_PATH);
  const modified = await modifySvg(svg);
  saveFile(ICON_PATH, modified);
  updateCaches();
}

exec();
