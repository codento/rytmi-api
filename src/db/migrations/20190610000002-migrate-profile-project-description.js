module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.sequelize.query(
      `UPDATE public."profileProject" AS p
      SET "role" = TO_JSONB(
        '{"fi":"' || ( SELECT title FROM public."profileProjectDescription" d WHERE d."profileProjectId" = p.id AND "language"='fi' )
        || '","en":"' || ( SELECT title FROM public."profileProjectDescription" d WHERE d."profileProjectId" = p.id AND "language"='en' )
        || '"}')`
    )
  },
  down: (queryInterface, Sequelize) => {
    return queryInterface.sequelize.query(
      `SELECT 1`)
  }
}
