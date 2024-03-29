const { Product: PoductModel } = require('../model/Product');

module.exports = {
  getProducts: async (_, resp, next) => {
    try {
      const products = await PoductModel.find({}, '_id name price image type createdAt');
      resp.json(products);
    } catch (error) {
      next(error);
    }
  },
  getProductById: async (req, resp, next) => {
    try {
      const { productId } = req.params;
      const product = await PoductModel.findById(productId, '_id name price image type createdAt');

      if (!product) resp.status(404).json({ error: 'Produto não encontrado.' });
      resp.json(product);
    } catch (error) {
      next(error);
    }
  },
  createProduct: async (req, resp, next) => {
    try {
      const {
        name,
        price,
        image,
        type,
      } = req.body;

      if (!name) {
        return resp.status(400).json({ error: 'O nome do produto é obrigatório.' });
      }

      if (!price) {
        return resp.status(400).json({ error: 'O preço do produto é obrigatório.' });
      }

      if (!image) {
        return resp.status(400).json({ error: 'A imagem do produto é obrigatória.' });
      }

      if (!type) {
        return resp.status(400).json({ error: 'O tipo do produto é obrigatório.' });
      }

      const productExists = await PoductModel.findOne({ name });
      if (productExists) {
        return resp.status(403).json({ error: 'Produto já cadastrado.' });
      }

      const { _id, createdAt } = await PoductModel.create({
        name, price, image, type,
      });

      resp.status(201).json({
        _id, name, price, image, type, createdAt,
      });
    } catch (error) {
      next(error);
    }
  },
  updateProduct: async (req, resp, next) => {
    try {
      const { productId } = req.params;
      const {
        name,
        price,
        image,
        type,
      } = req.body;

      const product = await PoductModel.findByIdAndUpdate(productId, {
        name,
        price,
        image,
        type,
      });

      if (!product) resp.status(404).json({ error: 'Produto não encontrado.' });

      const updatedProduct = await PoductModel.findById(productId, '_id name price image type createdAt');

      resp.status(200).json(updatedProduct);
    } catch (error) {
      next(error);
    }
  },
  deleteProduct: async (req, resp, next) => {
    try {
      const { productId } = req.params;
      const product = await PoductModel.findById(productId);

      if (!product) resp.status(404).json({ error: 'Produto não encontrado.' });

      const {
        _id, name, price, image, type, createdAt,
      } = await PoductModel.findByIdAndDelete(productId);

      resp.status(200).json({
        _id, name, price, image, type, createdAt,
      });
    } catch (error) {
      next(error);
    }
  },
};
