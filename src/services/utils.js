export const genericGetAll = async (model, modelDescription, mapDescriptionsToModelFunction, foreignKeyId, whereParameters, isParanoid) => {
  const modelInstances = await model.findAll({where: whereParameters, paranoid: isParanoid})
  const modelDescriptionInstances = await modelDescription.findAll()
  let mappedModels = modelInstances.map(modelInstance => {
    const modelInstanceDescriptions = modelDescriptionInstances.filter(description => description[foreignKeyId] === modelInstance.id)
    return mapDescriptionsToModelFunction(modelInstance, modelInstanceDescriptions)
  })

  return new Promise(resolve => {
    resolve(mappedModels)
  })
}

export const genericGet = async (model, modelDescription, mapDescriptionsToModelFunction, id, foreignKeyId) => {
  const modelInstance = await model.findById(id)
  let whereParameters = {}
  whereParameters[foreignKeyId] = id
  const modelInstanceDescriptions = await modelDescription.findAll({ where: whereParameters })

  return new Promise(resolve => {
    resolve(mapDescriptionsToModelFunction(modelInstance, modelInstanceDescriptions))
  })
}
