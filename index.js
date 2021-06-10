const cheerio = require('cheerio');
const fs = require('fs');
const path = require("path");
const handlebars = require('handlebars');


var xmlsrc = fs.readFileSync("040200.xml",'utf8').toString();
const $ = cheerio.load(xmlsrc, { normalizeWhitespace: true, xmlMode: true});

var personTemplateSource = fs.readFileSync("hbs/person.html",'utf8').toString();
var speakerTemplateSource = fs.readFileSync("hbs/speaker.html",'utf8').toString();
var pageTemplateSource   = fs.readFileSync("hbs/index.html",'utf8').toString();

var speakerTemplate = handlebars.compile(speakerTemplateSource);
var personTemplate = handlebars.compile(personTemplateSource);
var pageTemplate = handlebars.compile(pageTemplateSource);


let persons = {};

let out = '';

let feat = "";

$('CHAT').children().each(function(i, elem) {
	 // type: 'tag',
  // name: 'u',
  // attribs: { who: 'MIS', uID: 'u26' },

	if (elem.type == "tag"){
		if (elem.name === "Participants"){
			$(elem).children().each(function(i2, elem2) {
				const el = elem2.attribs;
				persons[el["id"]] = el;
			});
		} else if (elem.name === "u") {
			
			// console.log(persons[elem.attribs["who"]]["name"]);
			
			$(elem).children().each(function(i2, elem2) {
				const tp = elem2.attribs["type"]||'';
				if (tp==="situation") {
					
					
				} else if (tp === "flow") {
					// ??
				}
				else {
					if (elem2.name === "t") {
						if (tp === "p"){
							out += ".";
						} else if (tp === "q"){
							out += "?";
						}
					} else if (elem2.name === "tagMarker" && tp === "comma") {
						out += ",";
					} else if (elem2.name === "freecode") {
						out += `(${$(elem2).text()})`;
					} else if (elem2.name === "pause" && elem2.attribs["symbolic-length"] === "simple") {
						out += "..."
					} else if (elem2.name === "quotation") {
							 if (elem2.attribs["type"] === "begin") {
								 /// !!!!!!!!!!!!!!!!
								feat += " quot ";
							 } else {
								 feat = feat.replace (" quot ", "");
							 }
						    
					} else if (elem2.name !== "w") {
						console.log(elem2.name, tp);
						$(elem2).children().each(function(i3, elem3) {
							console.log("  ",elem3.name, tp);
						});
					}
				}
			});
			  // <u who="CHI" uID="u13">
				// <w>ewa</w>
				// <w>nie</w>
				// <w>przydarła</w>
				// <t type="p"></t>
			  // </u>
			// console.log(elem.name);
		}
		
	} else {
		console.log(elem.type);
	}
	// asdas
	// console.log(elem.attribs);
	// const el = elem.attribs;
	// persons[el["id"]] = el;
});



// console.log(persons);
