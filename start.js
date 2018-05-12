require('dotenv').config();

const mongo = require('./src/mongoController');
const parser = require('./src/parser');
// const mailer = require('./src/mailer');
const MongoSingleton = require('mongo-singleton');


const main = async(error, context, callback) => {
    let db = await(MongoSingleton)()
    let dbo = db[0].db('chgk')

    let tours = await mongo.getTours(dbo)

    let mainPage = await parser.load("https://db.chgk.info/tree")

    let toursList = parser.parseMainList(mainPage)

    let newTours = toursList.filter((e) => {
        return !tours.find(el => el.sid == e.sid);
    })

    if (newTours.length > 0)
        await mongo.saveEntitiesChanges(dbo, newTours)


    let questions = await parser.loadAllAdsTxt(newTours)
    console.log(questions)
};

main(null, null, console.log)

// exports.handler = main
