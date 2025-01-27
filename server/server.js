require("dotenv").config({ path: 'config.env' })
const express = require("express")
const app = express()
const mongoose = require("mongoose")
const multer = require('multer');
const User = require("./db_data/user")
const HCP = require("./db_data/hcp")
const zoomSdk = require('zoomus')
var cors = require('cors')
const { ObjectId } = require('mongodb')
const fs = require('fs');
const path = require('path');
const base64 = require('base64-js');

app.use(cors())
let MongoClient = require('mongodb').MongoClient;

mongoose
	.connect(process.env.ATLAS_URI, {
	  useNewUrlParser: true,
	  useUnifiedTopology: true,
	  useCreateIndex: true
	})
	.then(() => console.log("dataDB connected!"))
	.catch((err) => console.log(err))



	global.bodyParser = require('body-parser');

	app.use(bodyParser.urlencoded({
	  extended: true,
	  limit: '50mb',
	  parameterLimit: 100000
	}))
	app.use(bodyParser.json({
	  limit: '50mb',
	  parameterLimit: 100000
	}))

	var currentU
	app.post('/sign-up/user', (req, res) => {

	 const options = { timeZone: 'America/Montreal', year: 'numeric', month: '2-digit', day: '2-digit', hour: '2-digit', minute: '2-digit', second: '2-digit', hour12: false };
 	 const currentDate = new Date().toLocaleString('en-US', options);
 	 const logData = `${currentDate}: NEW USER REGISTERED : ${JSON.stringify(req.body)}\n`;

 	 fs.appendFile('logs/user.txt', logData, (err) => {
 		 if (err) throw err;
 	 });

		MongoClient.connect(process.env.ATLAS_URI, function(err, db) {
			currentU = req.body.email;
			var dba = db.db("DATA_FROM_EMAIL");
	    dba.collection('USER').insertOne(req.body, (err, data) => {
	        if(err) return console.log(err);
	        res.send(('saved to db: ' + data));
	    })
		});
	});

	var currentH
	app.post('/sign-up/HCP', (req, res) => {

		 const options = { timeZone: 'America/Montreal', year: 'numeric', month: '2-digit', day: '2-digit', hour: '2-digit', minute: '2-digit', second: '2-digit', hour12: false };
  	 const currentDate = new Date().toLocaleString('en-US', options);
  	 const logData = `${currentDate}: NEW HCP REGISTERED : ${JSON.stringify(req.body)}\n`;

  	 fs.appendFile('logs/hcp.txt', logData, (err) => {
  		 if (err) throw err;
  	 });


		MongoClient.connect(process.env.ATLAS_URI, function(err, db) {
			currentH = req.body.email;
			var dbo = db.db("DATA_FROM_EMAIL");
	    dbo.collection('HCP').insertOne(req.body, (err, data) => {
	        if(err) return console.log("ERROR");
	        res.send(('saved to db: ' + data));
	    })

		});
	});

	app.post('/sign-in/user', (req, res) => {

	 const options = { timeZone: 'America/Montreal', year: 'numeric', month: '2-digit', day: '2-digit', hour: '2-digit', minute: '2-digit', second: '2-digit', hour12: false };
	 const currentDate = new Date().toLocaleString('en-US', options);
	 const logData = `${currentDate}: SIGN-IN DETECTED WITH EMAIL : ${JSON.stringify(req.body.email)}\n`;

	 fs.appendFile('logs/user.txt', logData, (err) => {
		 if (err) throw err;
	 });

		currentU = req.body.email;
	});

	app.post('/sign-in/HCP', (req, res) => {

   const options = { timeZone: 'America/Montreal', year: 'numeric', month: '2-digit', day: '2-digit', hour: '2-digit', minute: '2-digit', second: '2-digit', hour12: false };
	 const currentDate = new Date().toLocaleString('en-US', options);
	 const logData = `${currentDate}: SIGN-IN DETECTED WITH EMAIL : ${JSON.stringify(req.body.email)}\n`;

	 fs.appendFile('logs/hcp.txt', logData, (err) => {
		 if (err) throw err;
	 });

		currentH = req.body.email;
	});






	app.post('/user/bookapt', async (req, res) => {
  const zoomDb = await MongoClient.connect(process.env.ATLAS_URI2);
  const connectDb = await MongoClient.connect(process.env.ATLAS_URI);
  const query = { type: req.body.type, reason: req.body.reason };
  const dboZoom = zoomDb.db("CONNECT");
  const dboConnect = connectDb.db("DATA_FROM_EMAIL");


  const hcpQuery = { profession: req.body.reason };
  const hcpResult = await dboConnect.collection('HCP').find(hcpQuery).toArray();

  const hcpEmails = hcpResult.map(hcp => hcp.email);
  const zoomQuery = { MeetingDate: req.body.date, MeetingTime: req.body.time};
  const bookedHCPs = await dboZoom.collection('zoom').find(zoomQuery).toArray();


	const resultWithoutConnect = hcpResult.filter((item) => {
  return !bookedHCPs.some((connectItem) => connectItem.HCP === item.email);
	});


  res.json(resultWithoutConnect);

  zoomDb.close();
  connectDb.close();
});



	app.post('/user/bookapt/all', (req, res) => {
		MongoClient.connect(process.env.ATLAS_URI, function(err, db) {
			var dbo = db.db("DATA_FROM_EMAIL");
  		dbo.collection('HCP').find({}).toArray(function(err, result) {
    	if (err) throw err;
			res.json(result)
			db.close()
  	});
		});
	});

	app.post('/HCP/booked/connect', (req, res) => {
		MongoClient.connect(process.env.ATLAS_URI2, function(err, db) {
			var dbo = db.db("CONNECT");
  		dbo.collection('zoom').find({HCP: currentH}).toArray(function(err, result) {
    	if (err) throw err;
			res.json(result)
			db.close()
  	});
		});
	});




	app.post('/user/profile/data', (req, res) => {
		console.log(req.body)
		res.send('yur')
	});


	app.post('/user/braceletdata', (req, res) => {
		MongoClient.connect(process.env.ATLAS_URI3, function(err, db) {
			var dbo = db.db("SENSOR_DATA");
			dbo.collection('Data').find({email: currentU}).toArray(function(err, result) {
			if (err) throw err;
			res.json(result)
			db.close()
		});
		});
	});




	app.post('/user/profile/hcp', (req, res) => {
  MongoClient.connect(process.env.ATLAS_URI, function(err, db) {
    var dbo = db.db("DATA_FROM_EMAIL");
    const emails = req.body;
    const results = [];

    for (let i = 0; i < emails.length; i++) {
      dbo.collection('USER').find({ email: emails[i] }).toArray(function(err, result) {
        if (err) throw err;
        results.push(result[0]);
        if (results.length === emails.length) {

          res.json(results);
          db.close();
        }
      });
    }
  });
});

app.post('/user/viewapts/HCPinfo', (req, res) => {
MongoClient.connect(process.env.ATLAS_URI, function(err, db) {
	var dbo = db.db("DATA_FROM_EMAIL");
	const emails = req.body;
	const results = [];

	for (let i = 0; i < emails.length; i++) {
		dbo.collection('HCP').find({ email: emails[i] }).toArray(function(err, result) {
			if (err) throw err;
			results.push(result[0]);
			if (results.length === emails.length) {
				res.json(results);
				db.close();
			}
		});
	}
});
});



app.post('/HCP/booked/all', async (req, res) => {
  try {
    const zoomDb = await MongoClient.connect(process.env.ATLAS_URI2);
    const connectDb = await MongoClient.connect(process.env.ATLAS_URI);
    const dboZoom = zoomDb.db("CONNECT");
    const dboConnect = connectDb.db("DATA_FROM_EMAIL");

    const HCP_client = await dboZoom.collection('zoom').find({ HCP: currentH }).toArray();
    var usersmap = HCP_client.map(function(client) {
      return client.user;
    });

    const users = await Promise.all(
      usersmap.map((email) =>
        dboConnect.collection('USER').find({ email }).toArray()
      )
    );

    // Wait for all the file reading operations to finish before sending the response
    await Promise.all(users);

    res.json(users);

    zoomDb.close();
    connectDb.close();
  } catch (error) {
    console.error(error);
    res.status(500).send("Internal Server Error");
  }
});




	app.post('/logout', (req, res) => {
		const options = { timeZone: 'America/Montreal', year: 'numeric', month: '2-digit', day: '2-digit', hour: '2-digit', minute: '2-digit', second: '2-digit', hour12: false };
		const currentDate = new Date().toLocaleString('en-US', options);
		const logData = `${currentDate}: LOG-OUT DETECTED WITH EMAIL : ${JSON.stringify(current(currentU, currentH))}\n`;

	 if(currentH === undefined || currentH == 'null'){

			  fs.appendFile('logs/user.txt', logData, (err) => {
				if (err) throw err;
			});

		}else if (currentU === undefined || currentU == 'null') {
			  fs.appendFile('logs/hcp.txt', logData, (err) => {
				if (err) throw err;
			});

		}else if(currentU === undefined && currentH === undefined){


		}


			if(req.body.status == 'logout'){
				currentH = 'null'
				currentU ='null'
			}
	});

	var collection = function(currentU, currentH) {
	  if (currentU === undefined || currentU == 'null') {
	    return 'HCP';
	  } else {
	    return 'USER';
	  }

	};
	var current = function(currentU, currentH) {
	  if (currentU === undefined || currentU == 'null') {
	    return currentH;
	  } else {
	    return currentU;
	  }
	};


	app.get('/user/profile', (req, res) => {
	    MongoClient.connect(process.env.ATLAS_URI, function(err, db) {
	        if (err) throw err;
	        var dbo = db.db("DATA_FROM_EMAIL");
	        dbo.collection(collection(currentU,currentH)).findOne({
	            email: current(currentU,currentH)
	        },
	        function(err, result) {
	            if (err) throw err;
							res.json(result);
	            db.close();
	        });
	    });
	});

	app.get('/user/past', async (req, res) => {
  try {
    const pasthcp = await MongoClient.connect(process.env.ATLAS_URI2);
    const pasthcpinfo = await MongoClient.connect(process.env.ATLAS_URI);
    const dbhcp = pasthcp.db("CONNECT");
    const dbhcpinfo = pasthcpinfo.db("DATA_FROM_EMAIL");

    const HCP_client = await dbhcp.collection('past').find({ user: currentU }).toArray();
    var usersmap = HCP_client.map(function(client) {
      return client.HCP;
    });


    const users = await Promise.all(
      usersmap.map((email) =>
        dbhcpinfo.collection('HCP').find({ email: email }).toArray()
      )
    );

    // Wait for all the file reading operations to finish before sending the response
    await Promise.all(users);



    res.json(users);

    pasthcp.close();
    pasthcpinfo.close();
  } catch (error) {
    console.error(error);
    res.status(500).send("Internal Server Error");
  }
});

app.get('/hcp/past', async (req, res) => {
try {
	const pasthcp = await MongoClient.connect(process.env.ATLAS_URI2);
	const pasthcpinfo = await MongoClient.connect(process.env.ATLAS_URI);
	const dbhcp = pasthcp.db("CONNECT");
	const dbhcpinfo = pasthcpinfo.db("DATA_FROM_EMAIL");

	const HCP_client = await dbhcp.collection('past').find({ HCP: currentH }).toArray();
	var usersmap = HCP_client.map(function(client) {
		return client.user;
	});
	console.log("HERE", HCP_client)


	const users = await Promise.all(
		usersmap.map((email) =>
			dbhcpinfo.collection('USER').find({ email: email }).toArray()
		)
	);

	// Wait for all the file reading operations to finish before sending the response
	await Promise.all(users);

	console.log(users)

	res.json(users);

	pasthcp.close();
	pasthcpinfo.close();
} catch (error) {
	console.error(error);
	res.status(500).send("Internal Server Error");
}
});





	app.get('/hcp/profile', (req, res) => {
	    MongoClient.connect(process.env.ATLAS_URI, function(err, db) {
	        if (err) throw err;
	        var dbo = db.db("DATA_FROM_EMAIL");
	        dbo.collection(collection(currentU,currentH)).findOne({
	            email: current(currentU,currentH)
	        },
	        function(err, result) {
	            if (err) throw err;
	            res.json(result);
	            db.close();
	        });
	    });
	});


const jwt = require('jsonwebtoken');

const zoompayload = {
  iss: 'h47ymZHRSWOpgdQCE79L9Q',
  exp: Math.floor(Date.now() / 1000) + 30 * 60, // 30 minutes
};

const secret = 'Z3qOFqQbVLlWfL1zunMlS34AYUy00bYHayjC';

const token = jwt.sign(zoompayload, secret);

const axios = require('axios');

const createMeeting = async (token, zoompayload2) => {
  try {
    const response = await axios.post(
      'https://api.zoom.us/v2/users/me/meetings',
      zoompayload2,
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );
    return response.data;
  } catch (error) {
    console.error(error);
  }
};


var meeting

const callCreateMeeting = async () => {
  const zoompayload2 = {
    topic: 'My Zoom Meeting',
    type: 2,
    start_time: '2022-12-31T12:00:00Z',
    duration: 60,
		host_email: 'test',
  };

  meeting = await createMeeting(token, zoompayload2);
};




app.post('/zoomid', async (req, res) => {
  res.json(meeting.join_url);
});

var zoomStart
var zoomJoin

app.post('/zoomidHCP', async (req, res) => {
  await callCreateMeeting();
  res.json('https://us04web.zoom.us/j/76598167728?pwd=lCWV9eTpSaxGbdlHeYNP91FFlU3ZA8.1');
	zoomStart = meeting.start_url;
	zoomJoin = meeting.join_url;
});

app.post('/user/booked', (req, res) => {
  MongoClient.connect(process.env.ATLAS_URI2, function(err, db) {
    const HCPbooked = {
      Username : 'null',
      user: current(currentU,currentH),
      HCP : req.body.HCPemail,
      HCPfirstname : req.body.HCPfirstname,
      HCPlastname: req.body.HCPlastname,
      MeetingDate: req.body.MeetingDate,
      MeetingTime: req.body.MeetingTime,
      zoomid : 'null'
    };
    var dbo = db.db("CONNECT");
      if (err) throw err;
			if (!req.body.canBook) {
				res.send('2');
      } else{
        dbo.collection('zoom').insertOne(HCPbooked, (err, data) => {
          if(err) {
            res.send('0');
          } else {
						const options = { timeZone: 'America/Montreal', year: 'numeric', month: '2-digit', day: '2-digit', hour: '2-digit', minute: '2-digit', second: '2-digit', hour12: false };
						const currentDate = new Date().toLocaleString('en-US', options);
						const logData = `${currentDate}: NEW APPOINTMENT BOOKED : ${JSON.stringify(HCPbooked)}\n`;

						fs.appendFile('logs/user.txt', logData, (err) => {
						   if (err) throw err;
						});
						fs.appendFile('logs/hcp.txt', logData, (err) => {
						   if (err) throw err;
						});
            res.send('1');
          }
        });
      }
  });
});


app.post('/user/viewapts', (req, res) => {
	MongoClient.connect(process.env.ATLAS_URI2, function(err, db) {
		var dbo = db.db("CONNECT");
		dbo.collection('zoom').find({user: currentU}).toArray(function(err, result) {
		if (err) throw err;
		res.json(result)
		db.close()
	});
	});
});

app.post('/hcp/viewapts', (req, res) => {
	console.log("Dasdas")
	MongoClient.connect(process.env.ATLAS_URI2, function(err, db) {
		var dbo = db.db("CONNECT");
		dbo.collection('zoom').find({HCP: currentH}).toArray(function(err, result) {
		if (err) throw err;
		res.json(result)
		db.close()
	});
	});
});


app.post('/HCP/dashboard', (req, res) => {
	MongoClient.connect(process.env.ATLAS_URI2, function(err, db) {
		var dbo = db.db("CONNECT");
		dbo.collection('zoom').find({HCP: currentH}).toArray(function(err, result) {
		if (err) throw err;
		res.json(result)
		db.close()
	});
	});
});


app.post('/user/profile/edit', (req, res) => {
  MongoClient.connect(process.env.ATLAS_URI, function(err, db) {
    var dba = db.db("DATA_FROM_EMAIL");
    const { email, firstname, lastname, phone, city, avatar } = req.body;
    dba.collection('USER').updateOne({ email }, { $set: { firstname, lastname, phone, city, avatar } }, (err, result) => {
      if (err) throw err;
      db.close()
      res.send("Successfully updated user");

			const options = { timeZone: 'America/Montreal', year: 'numeric', month: '2-digit', day: '2-digit', hour: '2-digit', minute: '2-digit', second: '2-digit', hour12: false };
			const currentDate = new Date().toLocaleString('en-US', options);
			const logData = `${currentDate}: USER INFO UPDATED : ${JSON.stringify(current(currentU, currentH))}, NEW INFO : ${JSON.stringify({ email, firstname, lastname, phone, city })}\n`;

			fs.appendFile('logs/user.txt', logData, (err) => {
				 if (err) throw err;

			});

    });
  });
});

app.post('/hcp/profile/edit', (req, res) => {
  MongoClient.connect(process.env.ATLAS_URI, function(err, db) {
    var dba = db.db("DATA_FROM_EMAIL");
    const { email, firstname, lastname, profession, specialty, city, avatar } = req.body;
    dba.collection('HCP').updateOne({ email }, { $set: { firstname, lastname, profession, specialty, city, avatar } }, (err, result) => {
      if (err) throw err;
      db.close()
      res.send("Successfully updated HCP");

			const options = { timeZone: 'America/Montreal', year: 'numeric', month: '2-digit', day: '2-digit', hour: '2-digit', minute: '2-digit', second: '2-digit', hour12: false };
			const currentDate = new Date().toLocaleString('en-US', options);
			const logData = `${currentDate}: HCP INFO UPDATED : ${JSON.stringify(current(currentU, currentH))}, NEW INFO : ${JSON.stringify({ firstname, lastname, profession, specialty, city })}\n`;

			fs.appendFile('logs/hcp.txt', logData, (err) => {
				 if (err) throw err;

			});

    });
  });
});




app.post('/user/cancel', (req, res) => {
	MongoClient.connect(process.env.ATLAS_URI2, function(err, db) {
		var dbo = db.db("CONNECT");
		dbo.collection('zoom').deleteMany({ HCP: req.body.email, user: currentU }, function(err, result) {
    if (err) throw err;
		res.sendStatus(200);
		db.close();

		const options = { timeZone: 'America/Montreal', year: 'numeric', month: '2-digit', day: '2-digit', hour: '2-digit', minute: '2-digit', second: '2-digit', hour12: false };
		const currentDate = new Date().toLocaleString('en-US', options);
		const logData = `${currentDate}: APPOINTMENT DELETED FOR : ${JSON.stringify(current(currentU, currentH))}, WITH ID : ${JSON.stringify(ObjectId(req.body.id))}\n`;

		fs.appendFile('logs/user.txt', logData, (err) => {
			 if (err) throw err;
		});

		fs.appendFile('logs/hcp.txt', logData, (err) => {
			 if (err) throw err;
		});

  	});

	});
});

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, 'uploads/')
  },
  filename: function (req, file, cb) {
    const ext = path.extname(file.originalname);
    const avatar = Date.now() + ext;
    cb(null, avatar);
  }
});

const upload = multer({ storage: storage });

app.post('/user/profile/image', upload.single('file'), (req, res) => {

  const options = { timeZone: 'America/Montreal', year: 'numeric', month: '2-digit', day: '2-digit', hour: '2-digit', minute: '2-digit', second: '2-digit', hour12: false };
  const currentDate = new Date().toLocaleString('en-US', options);
  const logData = `${currentDate}: PROFILE IMAGE ${JSON.stringify(req.body.file)} UPLOADED TO DATA BASE OF USER: ${JSON.stringify(currentU)}\n`;

  fs.appendFile('logs/user.txt', logData, (err) => {
    if (err) throw err;
  });

  const imagePath = path.join("./uploads", req.file.filename);
  let actualAvatar;

  fs.readFile(imagePath, function(err, data) {
    if (err) throw err;
    actualAvatar = 'data:image/jpeg;base64,' + base64.fromByteArray(data);

    MongoClient.connect(process.env.ATLAS_URI, function(err, db) {
      var dba = db.db("DATA_FROM_EMAIL");
      dba.collection('USER').updateOne({ email:currentU }, { $set: { avatar: actualAvatar } }, (err, result) => {
        if (err) throw err;
        db.close()
        res.send(req.body.file);
      });
    });
  });
});

app.post('/hcp/profile/image', upload.single('file'), (req, res) => {

  const options = { timeZone: 'America/Montreal', year: 'numeric', month: '2-digit', day: '2-digit', hour: '2-digit', minute: '2-digit', second: '2-digit', hour12: false };
  const currentDate = new Date().toLocaleString('en-US', options);
  const logData = `${currentDate}: PROFILE IMAGE ${JSON.stringify(req.body.file)} UPLOADED TO DATA BASE OF HCP: ${JSON.stringify(currentH)}\n`;

  fs.appendFile('logs/hcp.txt', logData, (err) => {
    if (err) throw err;
  });

  const imagePath = path.join("./uploads", req.file.filename);
  let actualAvatar;

  fs.readFile(imagePath, function(err, data) {
    if (err) throw err;
    actualAvatar = 'data:image/jpeg;base64,' + base64.fromByteArray(data);

    MongoClient.connect(process.env.ATLAS_URI, function(err, db) {
      var dba = db.db("DATA_FROM_EMAIL");
      dba.collection('HCP').updateOne({ email:currentH }, { $set: { avatar: actualAvatar } }, (err, result) => {
        if (err) throw err;
        db.close()
        res.send(req.body.file);
      });
    });
  });
});



app.post('/HCP/calendar', (req, res) => {
    MongoClient.connect(process.env.ATLAS_URI2, function(err, db) {
        var dbo = db.db("CONNECT");
        const query = {HCPlastname: req.body.name};
        dbo.collection('zoom').find(query).toArray(function(err, result) {
        if (err) throw err;
        res.json(result)
        db.close()
    });
    });
});

const PORT = process.env.PORT || 4444

app.listen(PORT, () => console.log(`Server is running on port ${PORT}`))
