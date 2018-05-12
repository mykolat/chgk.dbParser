const request = require('request');
const cheerio = require('cheerio');

String.prototype.isUpperCase = function () {
    return this.valueOf().toUpperCase() === this.valueOf();
};

class Parser {

    static async loadAllAdsTxt(domainList) {
        var promiseList = []
        // domainList = JSON.parse(JSON.stringify(domainList))
        // domainList.forEach((domain) => {
        let n = 0, l = 0;
        for (let [index, domain] of domainList.entries()) {
            promiseList.push(new Promise((resolve, reject) => {
                console.log("loading " + ++n + " " + domain.sid)
                return Parser.load("https://db.chgk.info/tour/" + domain.sid).then((body) => {
                    console.log(++l)
                    resolve(Parser.parseQuestionsPage(body))


                    // if ((body.toString().toLowerCase().search('<head|<div|<html|<HEAD')) === -1 ||
                    //     (body.toString().toLowerCase().search('reseller')) > -1 || (body.toString().toLowerCase().search('direct')) > -1) {
                    //     domainList[index].body = body;
                    //     console.log("OK " + domain.name)
                    //     resolve()
                    // } else {
                    //     console.log("No file " + domain.name)
                    //     resolve("No format of ads.txt")
                    // }
                });
            }))
        }
        return Promise.all(promiseList)
            .then((list) => {
                return domainList
            });
    }


    static async load(domain) {
        return new Promise((resolve, reject) =>
            request.get(domain, {
                headers: {
                    'User-Agent': 'Mozilla/5.0 (Windows NT 6.1; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/61.0.3163.100 Safari/537.36',
                    'Accept': 'text/plain',
                }, timeout: 12000
            }, (error, response, body) => {
                // logger.log('warn', `[domain check]
                //         domain: ${domain.what}
                //         statusCode: ${response.statusCode}
                //         contentType: ${response.headers["content-type"]}`)
                if (!error) {
                    //console.log(body, 12345);
                    // let checked = domain.checked ? domain.checked : false;
                    resolve(body)
                    // db.markTodo(domain.id, true, compareWithList(body, checked))
                } else {
                    // logger.log('error', '[domain check] error' + error)
                    resolve("LOAD ERROR")
                }
            }))
    }

    static parseQuestionsPage(body) {
        const $ = cheerio.load(body);
        let arr = []
        $(".question ").each((i, el) => {
                arr.push($(el).attr("id"))
            }
        )
        return arr
    }

    static parseMainList(body) {
        const $ = cheerio.load(body);
        let arr = []
        $("#main  li a").each((i, el) => {
            let href = $(el).attr("href")
            let title = $(el).text()

            let lastHref = href.split("/").pop()

            if (!lastHref.isUpperCase()) {

                arr.push({title, sid: lastHref})
            }
        })

        return arr

    }
}

module.exports = Parser