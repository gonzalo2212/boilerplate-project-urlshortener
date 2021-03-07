require('dotenv').config();

//db connection
var mongoose = require('mongoose');
mongoose.connect(process.env.DB_URI, { useNewUrlParser: true, useUnifiedTopology: true });


const urlSchema = new mongoose.Schema({
    original_url: { type: String, required: true },
    short_url: Number
})

let URLModel = mongoose.model("URL", urlSchema);

const saveURL = async function (original_url, done) {

    let url = new URLModel({ original_url: original_url, short_url: parseInt(await getMaxId() + 1) });

    url.save(function (err, data) {
        // if (err) return console.log(err);
        // console.log("PogU Saved");
        done(err, data);
    });

};

const getURL = (id, done) => {
    URLModel.findOne({short_url: id},function (err, data) {
        done(err, data);
    });
}

const getData = (done) => {
    URLModel.find(function (err, data) {
        done(err, data);
    });
}

const delData = (done) => {
    URLModel.remove(function (err, data) {
        // console.log("data removed");
        done(err, data);
    });
}


async function getMaxId() {
    let data = await URLModel.find()
        .sort("-short_url")
        .limit(1)
        .select("short_url");

    if (data.length) {
        return data[0].short_url;
    } else {
        return 0
    }

}

// exports
exports.URLModel = URLModel;
exports.saveURL = saveURL;
exports.getData = getData;
exports.getURL = getURL;
exports.delData = delData;