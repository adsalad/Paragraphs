const { Schema, model } = require("mongoose");

//model to dictate data for text edtitor
const Document = new Schema({
  _id: String,
  data: Object,
});

//export model
module.exports = model("Document", Document);
