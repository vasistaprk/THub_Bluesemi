const { MongoClient } = require('mongodb');
const mongoose = require("mongoose");
const uri = "mongodb+srv://admin:1234567890@customers.jsbdzhl.mongodb.net/";
const date = new Date().toLocaleDateString("en-IN");
var nodemailer = require('nodemailer');
 
var mandrillTransport = require('nodemailer-mandrill-transport');
 
var transport = nodemailer.createTransport(mandrillTransport({
  auth: {
    apiKey: ''
  }
}));
// const userSchema = new mongoose.Schema({
//     name: {
//       type: String,
//       required: true
//     },
//     email: {
//       type: String,
//       required: true,
//       unique: true
//     },
//     phone:{
//         type: String,
//         required: false,
//     },
//     no_products:{
//         type: Number,
//         required: true,
//     },
//     dop:{
//         type:String, //DD/MM/YYY
//         required: true,
//         default: date
//     }
//   });
async function main() {
  const client = new MongoClient(uri, {
    useNewUrlParser: true,
    useUnifiedTopology: true
  });

  try {
    await client.connect();
    console.log("Connected to MongoDB Atlas");

    // const database = client.db("Customers");
    // const collections = database.collection("Users");
    ////Database Operations////
    // const docs = [
    //     {name: "D.Sampath Kiran",email:"vasista.prk@gmail.com",phone:"+919490346894",no_products:4,dop:"12/04/2023"},
    //     {name: "S.Alex Samson",email:"vasista9490@gmail.com",phone:"+919490346894",no_products:4,dop:"25/04/2023"},
    //     {name: "P.Gowswami",email:"vasista3468@gmail.com",phone:"+919490346894",no_products:2,dop:"1/05/2023"}
    //   ];
    n=[];
    const data = await client.db('Customers').collection('Users').find({});
    await data.forEach(doc => {
        const ddate=doc.dop;
        const dateComponents = ddate.split('/');
        const day = dateComponents[0];
        const month = dateComponents[1] - 1; // month is 0-indexed in Date objects
        const year = dateComponents[2];
        const date1 = new Date(year, month, day);
        const date2 = new Date("2023-04-26"); //Fixed date

        const timestamp1 = date1.getTime();
        const timestamp2 = date2.getTime();

        if (timestamp1 > timestamp2){
            n.push(doc.email);
        }
        }
        );
    console.log(n);
    for(let i=0;i<n.length;i++){
        const emaild=n[i];
        transport.sendMail({
            from: 'Team Eyva <mansi.g@bluesemi.io>',
            to: emaild,
            subject: 'Test- Mail -01 BlueSemi',
            html: '<p>Test- Mail -01 BlueSemi</p>'
          }, function(err, info) {
            if (err) {
              console.error(err);
            } else {
              console.log(info);
            }
          });

    }


  } catch (err) {
    console.log(err);
  } finally {
    // Close the connection when finished
    // await client.close();
    // console.log("Disconnected from MongoDB Atlas");
  }
}

main();