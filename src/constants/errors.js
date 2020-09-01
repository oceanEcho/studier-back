const ERRORS = {
  FORBIDDEN: {
    status: 403,
    message: 'Forbidden',
  },
  UPDATE_DOCUMENT: {
    status: 400,
    message: 'Произошла ошибка при обновлении документа! Обновление невозможно.',
  },
  GET_DOCUMENT_LIST: {
    status: 400,
    message: 'Произошла ошибка при получении списка документов!',
  },
  DOCUMENT_NOT_FOUND: {
    status: 404,
    message: 'Документ не найден!',
  },
};

module.exports = ERRORS;
