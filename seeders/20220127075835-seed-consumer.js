'use strict';
const fs = require('fs')
module.exports = {
   up(queryInterface, Sequelize) {
    /**
     * Add seed commands here.
     *
     * Example:
     * await queryInterface.bulkInsert('People', [{
     *   name: 'John Doe',
     *   isBetaMember: false
     * }], {});
    */
    let data = JSON.parse(fs.readFileSync('./data/dataconsumer.json'))
    data.map(v => {
      v.createdAt = new Date(),
        v.updatedAt = new Date()
    })
    return queryInterface.bulkInsert("Consumers", data)
  },

   down(queryInterface, Sequelize) {
    /**
     * Add commands to revert seed here.
     *
     * Example:
     * await queryInterface.bulkDelete('People', null, {});
     */
    return queryInterface.bulkDelete("Consumers", null)
  }
};
