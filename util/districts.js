const axios = require('axios');
const Table = require('tty-table');
const { config, options } = require('./config');

module.exports = function (stateId) {
  axios
    .get(`https://cdn-api.co-vin.in/api/v2/admin/location/districts/${stateId}`, config)
    .then(function (response) {
      // handle success
      // console.table(response.data && response.data.states);
      let header = [{
        value: "district_id",
        headerColor: "cyan",
        color: "white",
        alias:"District Id",
        align: "left",
        width: 10
      },
      {
        value: "district_name",
        color: "red",
        alias:"District Name",
        width: 40
      
      }]
      const out = Table(header, response.data.districts, options).render();
      console.log(out);
    })

    .catch(function (error) {
      // handle error
      console.log(error);
    });
};
