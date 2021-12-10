const http = require("http");
const url = require("url");
const fs = require("fs");
const { MongoClient } = require("mongodb");
const client = new MongoClient("mongodb://localhost:27017");
const myDb = "faltaUno";

const server = http.createServer(function (req, res) {
	let body = "";

	res.setHeader("Access-Control-Allow-Origin", "*");

	req.on("data", (chunk) => {
		body += chunk;
	});

	req.on("end", () => {
		let parsedUrl = new url.URL(req.url, "http://localhost:8080");
		let search = parsedUrl.searchParams;
		if (parsedUrl.pathname === "/") {
			inicializa().then((respuesta) => {
				res.write(respuesta);
				res.end();
			});
		}
	});
});

server.listen(8080, () => {
	console.log("Conectado satisfactoriamente");
});

async function inicializa() {
	await client.connect();
	const db = client.db(myDb);
	const collection = db.collection("propuestas");
	let documentos = await collection.find({}).toArray();
	let respuesta = JSON.stringify(documentos);
	await client.close();
	return respuesta;
}
