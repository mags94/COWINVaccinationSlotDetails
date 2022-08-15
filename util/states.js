const axios = require('axios');
const Table = require('tty-table');
const { config, options } = require('./config');

module.exports = function () {
  axios
    .get('https://cdn-api.co-vin.in/api/v2/admin/location/states', config)
    .then(function (response) {
      // handle success
      // console.table(response.data && response.data.states);
      let header = [{
        value: "state_id",
        headerColor: "cyan",
        color: "white",
        alias:"State Id",
        align: "left",
        width: 10
      },
      {
        value: "state_name",
        color: "red",
        alias:"State Name",
        width: 40
      
      }]
      const out = Table(header, response.data.states, options).render();
      console.log(out);
    })

    .catch(function (error) {
      // handle error
      console.log(error);
    });
};
