// const db = require('../../db');
// const documentDb = db().document;

// get all product by filter
const getProductList = (req, res) => {
  const { status } = req.query;
  const statusSecurityCheck = 'SECURITY_CHECK';

  const productsSecurityCheck = productDb.content.filter(item => item.status === statusSecurityCheck);

  if (status === statusSecurityCheck) {
    return res.send({
      total: productsSecurityCheck.length,
      content: productsSecurityCheck,
    });
  }
  res.send(productDb);
};

// Add new product
const postProduct = (req, res) => {
  const { name } = req.body;

  const currentCustomer = customerDb.content[0];

  const tenant = {
    fullName: null,
    id: currentCustomer.id,
    name: currentCustomer.name,
  };

  const item = {
    tenant,
    id: uuidv4(),
    ...req.body,
  };

  const errorIdentifier = 'error';

  if (name !== errorIdentifier) {
    productDb.content.push(item);
    productDb.total++;
    return res.send(item);
  }

  res.sendStatus(452);
};

// Update product by id
const putProduct = (req, res) => {
  const { id } = req.params;
  const { name } = req.body;
  const errorIdentifier = 'error';
  const productIndex = productDb.content.findIndex(object => object.id === id);

  if (name !== errorIdentifier && productIndex !== -1) {
    const item = productDb.content[productIndex];

    productDb.content[productIndex] = {
      ...item,
      ...req.body,
    };

    return res.send(productDb.content[productIndex]);
  }

  res.sendStatus(404);
};

// Get product by id
const getProduct = (req, res) => {
  const { id } = req.params;
  const item = getItem(productDb, id);

  if (item) {
    return res.send(item);
  }

  res.sendStatus(404);
};

const deleteProduct = (req, res) => {
  const { id } = req.params;
  const productIndex = getItemIndex(productDb, id);

  if (productIndex !== -1) {
    productDb.content.splice(productIndex, 1);

    return res.send(productDb.content);
  }

  res.sendStatus(404);
};

// Download file from server
const getFile = (req, res) => {
  const { id, sampleId } = req.params;
  const fileName = 'sample.txt';
  const fileNameParams = path.parse(fileName);

  const files = fs.createReadStream(`./files/${fileName}`);

  res.writeHead(200, {
    'Content-disposition': `attachment; fileName=${fileNameParams.name}-${id}-${sampleId}${fileNameParams.ext}`,
  });

  files.pipe(res);
};

module.exports = {
  getDocumentList,
  getDocument,
};
