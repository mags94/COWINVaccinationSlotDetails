const axios = require('axios');
const Table = require('tty-table');
const { config, options } = require('./config');
const inquirer = require("inquirer");
const notifier = require("node-notifier");

module.exports = function (districtId) {
  const isoformat = new Date().toISOString();
  const date = new Date(isoformat);
  const year = date.getFullYear();
  let month = date.getMonth() + 1;
  let dt = date.getDate();

  if (dt < 10) {
    dt = '0' + dt;
  }
  if (month < 10) {
    month = '0' + month;
  }
  const todayDate = `${dt + '-' + month + '-' + year}`;
  inquirer
  .prompt([
    {
      type: "list",
      name: "Choice",
      message: "Please select age group.",
      choices:[{
        name:"All Ages",
        value: ""
      },
      {
        name:"45+",
        value: "45"
      },
      {
        name:"18-45",
        value: "18"
      }
    ]
    }
   
    /* Pass your questions in here */
  ])
  .then((answers) => {
    console.log(answers);
    // Use user feedback for... whatever!!
    axios
    .get(
      `https://cdn-api.co-vin.in/api/v2/appointment/sessions/public/calendarByDistrict?district_id=${districtId}&date=${todayDate}`,
      config
    )
    .then(function (response) {
      // handle success
      // console.table(response.data && response.data.states);
      let header = [
        {
          value: 'centreName',
          headerColor: 'cyan',
          color: 'white',
          alias: 'Centre Name',
          align: 'left',
          width: 40,
        },
        {
          value: 'centreAddress',
          color: 'red',
          alias: 'Centre Address',
          width: 40,
        },
        {
            value: 'available',
            color: 'red',
            alias: 'available',
            width: 10,
          },
          {
            value: 'age',
            color: 'red',
            alias: 'Age',
            width: 10,
          },
          {
            value: 'vaccine',
            color: 'red',
            alias: 'Vaccine',
            width: 30,
          },
          {
            value: 'date',
            color: 'red',
            alias: 'Date',
            width: 30,
          }
      ];
     
      let finalData = [];
      let districtName;
      response.data.centers.forEach((item) => {
        districtName = item.district_name;
        item.sessions.forEach((session) => {
          // console.log(session);
          if(answers.Choice == ""){
            let ourData = {
              centreName: item.name,
              centreAddress: item.address,
              available: session.available_capacity,
             // availableDose1: session.available_capacity_dose1,
             // availableDose2: session.available_capacity_dose2,
              age: session.min_age_limit,
            //  maxAge: session.max_age_limit,
              vaccine: session.vaccine,
              date: session.date
            };
            finalData.push(ourData);

          }
          else if(answers.Choice == session.min_age_limit){
            let ourData = {
              centreName: item.name,
              centreAddress: item.address,
              available: session.available_capacity,
             // availableDose1: session.available_capacity_dose1,
             // availableDose2: session.available_capacity_dose2,
              age: session.min_age_limit,
            //  maxAge: session.max_age_limit,
              vaccine: session.vaccine,
              date: session.date
            };
            finalData.push(ourData);

          }
         
        });
      });
    const out = Table(header, finalData, options).render();
    
    console.log(out);
    notifier.notify({
      title: "Cowin slots executed",
      message: "Code executed",
      wait: true
    })

    })

    .catch(function (error) {
      // handle error
      console.log(error);
    });
  })
  .catch((error) => {
    if (error.isTtyError) {
      // Prompt couldn't be rendered in the current environment
    } else {
      // Something else went wrong
    }
  });
 
};
