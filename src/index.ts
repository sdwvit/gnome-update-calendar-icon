import dotenv from "dotenv";
import fs from "fs";
import { spawn } from "child_process";
import xml2js, { ElementCompact } from "xml-js";
import { SVG } from "../types/interfaces";

dotenv.config();

const log = (...data: string[]) => console.log(new Date(), ...data);
const ICON_PATH = process.env.ICON_PATH || "";

if (!ICON_PATH || !fs.existsSync(ICON_PATH)) {
  console.error("You must provide ICON_PATH env var, see .env-example.");
  process.exit(1);
}

function saveFile(where: string, data: string) {
  fs.writeFileSync(where, data);
  log(`Saved svg as: ${where}`);
}

function readSvg(where: string): string {
  return fs.readFileSync(where).toString();
}

function getSVGXml(data: string): SVG {
  return (xml2js.xml2js(data, {
    compact: true,
  }) as unknown) as SVG;
}

function updateSVG(svg: SVG): boolean {
  const today = new Date();
  const date = today.getDate().toString();
  const month = today.toString().slice(4, 7);

  if (
    svg.svg.g.g.text[0]._text !== date ||
    svg.svg.g.g.text[1]._text !== month
  ) {
    svg.svg.g.g.text[0]._text = date;
    svg.svg.g.g.text[1]._text = month;
    return true;
  }

  return false;
}

function convertBack(svg: SVG):string {
  return xml2js.js2xml((svg as unknown) as ElementCompact, {
    compact: true,
    spaces: 2,
  });
}

function updateCaches() {
  const child = spawn("bash", ["-c", "update-icon-caches /usr/share/icons/*"]);
  child.on("exit", () => log("Cache updated successfully"));
}

async function exec() {
  const svg: string = readSvg(ICON_PATH);
  const svgXml: SVG = getSVGXml(svg);
  const updated = updateSVG(svgXml);
  if (updated) {
    saveFile(ICON_PATH, convertBack(svgXml));
  } else {
    console.log('Nothing to update')
  }
  updateCaches();
}

exec();
