const express = require("express");
const app = express();
const request = require("request");
const https = require("https");

app.use(express.static("public"));
app.use(express.json());
app.use(
  express.urlencoded({
    extended: true,
  })
);

app.listen(process.env.PORT || 3000, () => {
  console.log("Server Started ");
});

app.get("/", (req, res) => {
  res.sendFile(__dirname + "/public/index.html");
});

app.post("/", (req, res) => {
  const email = req.body.email;
  const fname = req.body.Fname;
  const lname = req.body.Lname;

  const data = {
    members: [
      {
        email_address: email,
        status: "subscribed",
        merge_fields: {
          FNAME: fname,
          LNAME: lname,
        },
      },
    ],
  };

  const jsondata = JSON.stringify(data);

  const url = `https://us13.api.mailchimp.com/3.0/lists/90ffc8c723`;

  const option = {
    method: "POST",
    auth: "user:f80b2eb4a675e4718cf2a5ea1d0128c8-us13",
  };

  const request = https.request(url, option, (response) => {
    if (response.statusCode === 200) {
      res.sendFile(__dirname + "/public/success.html");
    } else {
      res.sendFile(__dirname + "/public/fail.html");
    }  
  });
  request.write(jsondata);
  request.end();
});

app.post("/fail", (req, res) => {
  res.redirect("/");
});
