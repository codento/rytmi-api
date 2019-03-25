export const DEFAULT_LANGUAGE = 'fi'

export const genericGetAll = async (model, modelDescription, mapModelToModelDescriptionFunction, language) => {
  const modelInstances = await model.findAll()
  const modelDescriptionsInCorrectLanguage = await modelDescription.findAll({ where: { 'language': language } })
  let mappedModels = modelInstances.map(modelInstance => {
    const modelInstanceDescription = modelDescriptionsInCorrectLanguage.find(description => description.projectId === modelInstance.id)
    return mapModelToModelDescriptionFunction(modelInstance, modelInstanceDescription)
  })

  return new Promise(resolve => {
    resolve(mappedModels)
  })
}

export const genericGet = async (model, modelDescription, mapModelToModelDescriptionFunction, language, id, foreignKeyId) => {
  const modelInstance = await model.findById(id)
  let whereParameters = { language: language }
  whereParameters[foreignKeyId] = id
  const modelDescriptionsInCorrectLanguage = await modelDescription.findOne({ where: whereParameters })

  return new Promise(resolve => {
    resolve(mapModelToModelDescriptionFunction(modelInstance, modelDescriptionsInCorrectLanguage))
  })
}
