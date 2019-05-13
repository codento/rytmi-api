module.exports = {
  up: async (queryInterface) => {
    return queryInterface.sequelize.query('INSERT INTO public."projectDescription" ("projectId", "name", "customerName", "description", "language", "createdAt", "updatedAt") SELECT "id", "name", \'\', "description", \'fi\', NOW(), NOW() FROM public."project" RETURNING *', {
      type: queryInterface.sequelize.QueryTypes.INSERT
    })
  },

  down: async (queryInterface) => {
    return queryInterface.sequelize.query('DELETE FROM public."projectDescription"', {
      type: queryInterface.sequelize.QueryTypes.DELETE
    })
  }
}
