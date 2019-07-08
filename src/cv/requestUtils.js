export const deleteTableRowRequest = (tableObjectId, row) => {
  return {
    deleteTableRow: {
      tableObjectId: tableObjectId,
      cellLocation: {
        rowIndex: row
      }
    }
  }
}

export const duplicateObjectRequest = (objectId, newIds = {}) => {
  return {
    duplicateObject: {
      objectId: objectId,
      objectIds: newIds
    }
  }
}

export const modifyTableTextRequest = (methodKey, tableObjectId, row, col, textValueOrRange) => {
  return {
    // insertText or deleteText
    [methodKey]: {
      objectId: tableObjectId,
      cellLocation: {
        rowIndex: row,
        columnIndex: col
      },
      // for deleting, define text range: {'type': 'ALL'} will delete all text
      [methodKey === 'insertText' ? 'text' : 'textRange']: textValueOrRange
    }
  }
}

export const moveObjectRequest = (mode, objectId, originalTransformation, transformObject, unit) => {
  const absoluteTransform = {
    scaleX: transformObject.scaleX || originalTransformation.scaleX,
    scaleY: transformObject.scaleY || originalTransformation.scaleY,
    translateX: transformObject.translateX || originalTransformation.translateX,
    translateY: transformObject.translateY || originalTransformation.translateY,
    unit: unit || 'EMU'
  }

  const relativeTransform = {
    scaleX: 1,
    scaleY: 1,
    translateX: transformObject.translateX || 0,
    translateY: transformObject.translateY || 0,
    unit: unit || 'EMU'
  }

  return {
    updatePageElementTransform: {
      objectId: objectId,
      applyMode: mode,
      transform: mode === 'RELATIVE' ? relativeTransform : absoluteTransform
    }
  }
}

export const replaceAllTextRequest = (textToFind, replaceWith) => {
  return {
    replaceAllText: {
      containsText: {
        text: textToFind
      },
      replaceText: replaceWith
    }
  }
}

export const updateShapeFillColorRequest = (shapeObjectId, newColor) => {
  return {
    updateShapeProperties: {
      objectId: shapeObjectId,
      fields: 'shapeBackgroundFill.solidFill.color',
      shapeProperties: {
        shapeBackgroundFill: {
          solidFill: {
            color: newColor
          }
        }
      }
    }
  }
}
