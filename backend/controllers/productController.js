
import asyncHandler from "../middlewares/asyncHandler.js"
import Product from "../models/productModel.js";

// async handlers prevents unnecessary try/catch blocks


// @desc fetches all products
// @route GET /api/products
// @access public
export const getProducts = asyncHandler(async (req, res) => {
    const pageSize = 8;
    const page = Number(req.query.pageNumber) || 1;

    // using regex because we want product matching our string not comletely eg if we search iphone10 we mus also get result of phone, options:i is for case insensitivity
    const keyword = req.query.keyword ? { name: { $regex: req.query.keyword, $options: 'i' } } : {}

    const products = await Product.find({ ...keyword }).limit(pageSize).skip(pageSize * (page - 1));
    const count = await Product.countDocuments({ ...keyword });
    res.json({ products, page, pages: Math.ceil(count / pageSize) });

});


// @desc fetches product with specified id
// @route GET /api/product/:id
// @access public
export const getProductById = asyncHandler(async (req, res) => {
    const product = await Product.findById(req.params.id);

    if (product) {
        return res.json(product);
    }
    else {
        res.status(404);
        throw new Error('Product not found');
    }

});
//  @desc crreates product 
// @route POST /api/product/
// @access admin
export const createProduct = asyncHandler(async (req, res) => {
    const product = new Product({
        name: 'New',
        price: 0,
        user: req.user._id,
        image: 'New',
        category: 'New',
        brand: 'New',
        countInStock: 0,
        numReview: 0,
        description: 'New',

    })
    const saveProduct = await product.save();
    res.status(201).json(saveProduct);

});

export const updateProduct = asyncHandler(async (req, res) => {
    const { name, price, description, image, brand, category, countInStock } =
        req.body;

    const product = await Product.findById(req.params.id);

    if (product) {
        product.name = name;
        product.price = price;
        product.description = description;
        product.image = image;
        product.brand = brand;
        product.category = category;
        product.countInStock = countInStock;

        const updatedProduct = await product.save();
        res.json(updatedProduct);
    } else {
        res.status(404);
        throw new Error('Product not found');
    }
});

export const deleteProduct = asyncHandler(async (req, res) => {
    const product = await Product.findById(req.params.id);
    if (product) {
        await Product.deleteOne({ _id: product._id });
        res.status(200).json({ message: 'Product Deleted' });
    }
    else {
        res.status(404);
        throw new Error('Product not found');
    }
});


export const createProductReview = asyncHandler(async (req, res) => {
    const { rating, comment } = req.body;

    const product = await Product.findById(req.params.id);

    if (product) {
        const alreadyReviewed = product.reviews.find(
            (r) => r.user.toString() === req.user._id.toString()
        );

        if (alreadyReviewed) {
            res.status(400);
            throw new Error('Product already reviewed');
        }

        const review = {
            name: req.user.name,
            rating: Number(rating),
            comment,
            user: req.user._id,
        };

        product.reviews.push(review);

        product.numReviews = product.reviews.length;

        product.rating =
            product.reviews.reduce((acc, item) => item.rating + acc, 0) /
            product.reviews.length;

        await product.save();
        res.status(201).json({ message: 'Review added' });
    } else {
        res.status(404);
        throw new Error('Product not found');
    }
});

export const getTopProducts = asyncHandler(async (req, res) => {
    const products = await Product.find({}).sort({ rating: -1 }).limit(3);

    res.json(products);
});
