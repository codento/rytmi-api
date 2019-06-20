module.exports = {
  up: async (queryInterface) => {
    return queryInterface.sequelize.query('INSERT INTO public."profileProjectDescription" ("profileProjectId", "title", "language", "createdAt", "updatedAt") SELECT "id", \'\', \'fi\', NOW(), NOW() FROM public."profileProject" RETURNING *', {
      type: queryInterface.sequelize.QueryTypes.INSERT
    })
  },

  down: async (queryInterface) => {
    return queryInterface.sequelize.query('DELETE FROM public."profileProjectDescription"', {
      type: queryInterface.sequelize.QueryTypes.DELETE
    })
  }
}
