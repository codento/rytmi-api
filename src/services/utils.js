export const genericGetAll = async (model, modelDescription, mapDescriptionsToModelFunction, foreignKeyId, whereParameters, isParanoid) => {
  const modelInstances = await model.findAll({where: whereParameters, paranoid: isParanoid})
  const modelDescriptionInstances = await modelDescription.findAll({attributes: { exclude: ['deletedAt'] }})
  let mappedModels = modelInstances.map(modelInstance => {
    const modelInstanceDescriptions = modelDescriptionInstances.filter(description => description[foreignKeyId] === modelInstance.id)
    return mapDescriptionsToModelFunction(modelInstance, modelInstanceDescriptions)
  })

  return new Promise(resolve => {
    resolve(mappedModels)
  })
}

export const genericGet = async (model, modelDescription, mapDescriptionsToModelFunction, id, foreignKeyId) => {
  const modelInstance = await model.findByPk(id, {attributes: { exclude: ['deletedAt'] }})
  let whereParameters = {}
  whereParameters[foreignKeyId] = id
  const modelInstanceDescriptions = await modelDescription.findAll({ where: whereParameters })

  return new Promise(resolve => {
    resolve(mapDescriptionsToModelFunction(modelInstance, modelInstanceDescriptions))
  })
}

export const genericDelete = async (model, modelDescription, id, foreignKeyId) => {
  let whereParameters = {}
  whereParameters[foreignKeyId] = id
  await modelDescription.destroy({where: whereParameters})
  await model.destroy({where: { id: id }})
  return { id }
}

export const genericUpdate = async (model, modelDescription, id, attributes, foreignKeyId, getFunction, descriptionsPropertyName = 'descriptions') => {
  await model.update(attributes, { where: { id } })
  for (const description of attributes[descriptionsPropertyName]) {
    if (description.id) {
      await modelDescription.update(description, {where: {id: description.id}})
    } else {
      let newDesciption = { ...description }
      newDesciption[foreignKeyId] = id
      await modelDescription.build(newDesciption).save()
    }
  }
  return getFunction(id)
}

export const genericCreate = async (model, modelDescription, attributes, foreignKeyId, getFunction, descriptionsPropertyName = 'descriptions') => {
  const newModel = await model
    .build(attributes)
    .save()
    .then(createdModel => getFunction(createdModel.id))
  for (const description of attributes[descriptionsPropertyName]) {
    let newDesciption = { ...description }
    newDesciption[foreignKeyId] = newModel.id
    await modelDescription.build(newDesciption).save()
  }
  return getFunction(newModel.id)
}
