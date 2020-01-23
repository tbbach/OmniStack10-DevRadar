const axios = require('axios');
const Dev = require('../models/Dev');
const parseStringAsArray = require('../utils/parseStringAsArray');
const { findConnections, sendMessage } = require('../websockets');

// index, show, store, update, destroy

module.exports = {
  async index(request, response) {
    const devs = await Dev.find();

    return response.json(devs);
  },

  async store(request, response) {
    console.log(request.body);
    const { github_username, techs, latitude, longitude } = request.body;

    let dev = await Dev.findOne({ github_username });

    if (!dev) {
      const apiResponse = await axios.get(
        `https://api.github.com/users/${github_username}`
      );

      const { name = login, avatar_url, bio } = apiResponse.data;

      const techsArray = parseStringAsArray(techs);
      const location = {
        type: 'Point',
        coordinates: [longitude, latitude]
      };

      dev = await Dev.create({
        github_username,
        name,
        avatar_url,
        bio,
        techs: techsArray,
        location
      });

      console.log(name, avatar_url, bio, github_username);

      // Filtra as conexões que estão no máximo 10km de distância e pelo menos uma das techs filtradas

      const sendSocketMessageTo = findConnections(
        { latitude, longitude },
        techsArray,
      )
      
      sendMessage(sendSocketMessageTo, 'new-dev', dev);
      console.log(sendSocketMessageTo);
    }

    return response.json(dev);
  },

  async update() {},

  async destroy() {}
};
