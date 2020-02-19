var express = require('express');
var router = express.Router();
const Mlab = require('./models/Mlab.js');
const async = require('async');
const moment = require('moment');

/* GET home page. */
router.get('/', function(req, res, next) {
    res.redirect('https://www.tranquility.tech');
});

router.get('/hello', function(req, res, next) {
    res.json('hello')
});

router.get('/ntou', async (req, res, next) => {
    // authorize
    let device = await Mlab.getDevice();
    let datas = await Mlab.getData();

    if (device.allow_insert && datas.length < 10000) {
        next();
    } else {
        res.status(503).send({
            status: 503 // Service Unavailable
        });
    }
}, (req, res) => {
    let data = req.query;
    let randomNum_15_16 = () => Number((Math.random() * (16 - 15) + 15).toFixed(2));
    let randomNum_18_19 = () => Number((Math.random() * (19 - 18) + 18).toFixed(2));

    data.created_at = new Date();

    if (req.query.flows && req.query.t) {
        if (Array.isArray(req.query.flows)) {
            req.query.flows.forEach((flow, index) => {
                let data = {
                    flow: Number(flow),
                    o2: Math.sign(flow) > 0 ? randomNum_18_19() : randomNum_15_16(),
                    t: Number(req.query.t[index]),
                    created_at: new Date()
                }

                Mlab.saveData(data);
            });

            res.status(200).send({
                status: 200
            });
        } else {
            let data = {
                flow: Number(req.query.flows),
                o2: Math.sign(req.query.flows) > 0 ? randomNum_18_19() : randomNum_15_16(),
                t: Number(req.query.t[0]),
                created_at: new Date()
            }

            Mlab.saveData(data);

            res.status(200).send({
                status: 200
            });
        }
    } else {
        res.status(503).send({
            status: 503 // Service Unavailable
        });
    }
})

router.get('/project/ntou/data.json', async (req, res) => {
    let datas = await Mlab.getData();
    let data_20 = datas.map(data => {
        data.t = moment(new Date(data.created_at)).format('ss.SSS');
        data.created_at = moment(new Date(data.created_at)).format('MMMM Do YYYY, h:mm:ss a');

        return data;
    }).slice(0, 20);

    res.json(data_20);
});

module.exports = router;
