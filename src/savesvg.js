'use strict';

const xmlPreface = '<?xml version="1.0" standalone="no"?>\n';
const xmlNamespace = 'http://www.w3.org/2000/svg';

function saveSvg(){
  const url = buildUrl();
  const downloadLink = document.createElement("a");
  downloadLink.href = url;
  downloadLink.download = buildFilename();

  document.body.appendChild(downloadLink);
  downloadLink.click();
  document.body.removeChild(downloadLink);
}

function buildUrl(){
  const svg = document.getElementById('drawing');
  svg.setAttribute("xmlns", xmlNamespace);
  const blob = new Blob([xmlPreface, svg.outerHTML], {type:"image/svg+xml;charset=utf-8"});
  return URL.createObjectURL(blob);
}

function buildFilename(){
  const d = new Date();
  const pad2 = n => ('00' + n).slice(-2);
  const date = `${d.getFullYear()}-${pad2(d.getMonth()+1)}-${pad2(d.getDate())}`;
  const time = `${pad2(d.getHours())}${pad2(d.getMinutes())}${pad2(d.getSeconds())}`;
  return `galdr-${date}T${time}.svg`;
}

module.exports = saveSvg;
