const http = require("http");
const fs = require("fs")
var requests = require("requests");

const homeFile = fs.readFileSync("Home.html", "utf-8");

const replaceVal = (tempVal, orgVal) => {
    let temprature = tempVal.replace("{%tempvalue}", orgVal.main.temp);
    temprature = temprature.replace("{%tempmin}", orgVal.main.temp_min);
    temprature = temprature.replace("{%tempmax}", orgVal.main.temp_max);
    temprature = temprature.replace("{%location}", orgVal.name);
    temprature = temprature.replace("{%country}", orgVal.sys.country);
    temprature = temprature.replace("{%tempstatus}", orgVal.weather[0].main);
    return temprature;
}

const server = http.createServer((req, res) => {
    if (req.url == "/") {
        requests(
                `https://api.openweathermap.org/data/2.5/weather?q=Surendranagar&units=metric&appid=0a58780ec818df59419bc8611f79bfbc`
            )
            .on("data", (chunk) => {
                const objdata = JSON.parse(chunk);
                const arrData = [objdata];
                // console.log(arrData[0].main.temp);
                const realTimeData = arrData
                    .map((val) => replaceVal(homeFile, val))
                    .join("");
                res.write(realTimeData);
                // console.log(realTimeData);
            })
            .on("end", (err) => {
                if (err) return console.log("connection closed due to errors", err);
                res.end();
            });
    } else {
        res.end("File not found");
    }
});

server.listen(2000, "127.0.0.1", () => {
    console.log("Okay boss");
});