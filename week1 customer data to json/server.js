//const url = "https://prod-edxapp.edx-cdn.org/assets/courseware/v1/07d100219da1a726dad5eddb090fa215/asset-v1:Microsoft+DEV283x+2T2018+type@asset+block/customer-data.csv"
 fs = require("fs")
 https = require("https")
 uuidv1 = require("uuid")
 csv_to_json = require("csvjson")
 path = require("path")

 var options = {
   delimiter : ',', // optional
   quote     : '"' // optional
 };

convert_to_json = (url)=>{
  console.log("downloading ...")
  fetchdata= (urlf,callback)=>{

    https.get(urlf,(response)=>{
     let rawData = "";
     response.on("data",(chunk)=>{

       rawData = rawData+chunk

     })
     response.on("end",()=>{
       callback(null,rawData);
       //console.log(rawData);
     })
    }).on("error",(error)=>{
     console.log("got error : " , error.message);
     callback(error)
    })
  }

  foldername = uuidv1();

  fetchdata(url,(error,csv_data)=>{

    if(error){
      return console.log(error)
    }
    else{
      try {
        //console.log(csv_data);
        console.log("started decoding");
        data = csv_to_json.toObject(csv_data, options);
        //console.log( data);
        fs.mkdirSync(foldername);
        console.log("folder ",foldername," created");
        fs.writeFileSync(path.join(__dirname,foldername,'file.txt'),JSON.stringify(data))
        console.log("sucessfully converted and written to file");
      } catch (e) {
          console.log("error : ",e.message);
      } finally {
          return false;
      }
    }
  })

}

convert_to_json(process.argv[2])
