module.exports = {
  up: (queryInterface) => {
    return queryInterface.sequelize.transaction((t) => {
      return Promise.all([
        queryInterface.sequelize.query(
          `UPDATE public."project" AS p
          SET "name" = json_build_object(
            'fi', COALESCE((SELECT name FROM public."projectDescription" d WHERE d."projectId" = p.id AND "language"='fi'),''),
            'en', COALESCE((SELECT name FROM public."projectDescription" d WHERE d."projectId" = p.id AND "language"='en'),'')
            )
          `, { transaction: t }),
        queryInterface.sequelize.query(
          `UPDATE public."project" AS p
          SET "customerName" = json_build_object(
            'fi', COALESCE((SELECT "customerName" FROM public."projectDescription" d WHERE d."projectId" = p.id AND "language"='fi'),''),
            'en', COALESCE((SELECT "customerName" FROM public."projectDescription" d WHERE d."projectId" = p.id AND "language"='en'),'')
            )
          `, { transaction: t }),
        queryInterface.sequelize.query(
          `UPDATE public."project" AS p
          SET "description" = json_build_object(
            'fi', COALESCE((SELECT "description" FROM public."projectDescription" d WHERE d."projectId" = p.id AND "language"='fi'),''),
            'en', COALESCE((SELECT "description" FROM public."projectDescription" d WHERE d."projectId" = p.id AND "language"='en'),'')
            )
          `, { transaction: t })
      ])
    })
  },
  down: (queryInterface) => {
    return queryInterface.sequelize.query(
      `SELECT 1`)
  }
}
