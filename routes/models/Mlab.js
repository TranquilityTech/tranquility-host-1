const mongodb = require('mongodb');
const mongodbUrl = 'mongodb://tq:testtest123@ds211368.mlab.com:11368/ntou';

function Mlab(mlab) {
    this.name = mlab.name;
    this.uid = mlab.uid;
    this.datas = mlab.datas;
    this.sharings = mlab.sharings;
    this.property = mlab.property;
    this.updated_at = mlab.updated_at;
    this.created_at = mlab.created_at;
}

module.exports = Mlab;

Mlab.getDevice = async() => {
    const client = await mongodb.MongoClient.connect(mongodbUrl, {
            useNewUrlParser: true,
            useUnifiedTopology: true
        })
        .catch(err => {
            if (err) throw err;
        });
    try {
        const result = await client.db("ntou").collection('device').findOne({
             "name": "ntou"
        }, {
            projection: {
                _id: 0
            }
        });
        return result;
    } catch (err) {
        if (err) throw err;
    } finally {
        client.close();
    }
}

Mlab.getData = async() => {
    const client = await mongodb.MongoClient.connect(mongodbUrl, {
            useNewUrlParser: true,
            useUnifiedTopology: true
        })
        .catch(err => {
            if (err) throw err;
        });
    try {
        const result = await client.db("ntou").collection('data').find({}).toArray();

        return result;
    } catch (err) {
        if (err) throw err;
    } finally {
        client.close();
    }
}

Mlab.changeAllow_insert = (status, callback) => {
    mongodb.MongoClient.connect(mongodbUrl, {
        useNewUrlParser: true,
        useUnifiedTopology: true
    }, (err, db) => {
        if (err) throw err;
        const dbo = db.db("ntou");

        dbo.collection('device', (err, collection) => {
            if (err) throw err;
            // $all maybe other ele in array, so must be limit to $size 2 !!!
            collection.updateOne({
                "name": "ntou"
            }, {
                "$set": {
                    "allow_insert": status
                }
            }, (err) => {
                db.close();
                if (err) throw err;

                callback(err);
            });
        });
    });
};

Mlab.delAllData = (callback) => {
    mongodb.MongoClient.connect(mongodbUrl, {
        useNewUrlParser: true,
        useUnifiedTopology: true
    }, (err, db) => {
        if (err) throw err;
        const dbo = db.db("ntou");

        dbo.collection('data', (err, collection) => {
            if (err) throw err;
            // $all maybe other ele in array, so must be limit to $size 2 !!!
            collection.deleteMany({}, (err) => {
                db.close();
                if (err) throw err;

                callback(err);
            });
        });
    });
};

Mlab.getData_20 = (callback) => {
    mongodb.MongoClient.connect(mongodbUrl, {
        useNewUrlParser: true,
        useUnifiedTopology: true
    }, (err, db) => {
        if (err) throw err;
        const dbo = db.db("ntou");

        dbo.collection('data', (err, collection) => {
            if (err) throw err;
            collection.find({}).sort({created_at: -1}).limit(10).toArray((err, datas) => {
                db.close();
                if (err) throw err;

                callback(datas);
            });
        });
    });
};

Mlab.saveData = (data) => {console.log(data);
    mongodb.MongoClient.connect(mongodbUrl, {
        useNewUrlParser: true,
        useUnifiedTopology: true
    }, (err, db) => {
        if (err) throw err;
        const dbo = db.db("ntou");

        dbo.collection('data', (err, collection) => {
            if (err) throw err;
            collection.insertOne(data, {
                safe: true
            }, (err) => {
                db.close();
                if (err) throw err;
            });
        });
    });
};
