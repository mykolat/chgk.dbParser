const mongodb = require('mongodb');

class MongoController {
    static async getTours(dbo) {
        return new Promise((resolve, reject) =>
            dbo.collection("tours").find().toArray(function (err, docs) {
                resolve(docs)
            })
        )
    }

    static async saveEntitiesChanges(dbo, tours) {
        var bulk = dbo.collection("tours").initializeUnorderedBulkOp();
        for (let tour of tours)
            bulk.find({sid: tour.sid}).upsert().updateOne(
                tour
            );
        return bulk.execute();
    }
}

module.exports = MongoController;