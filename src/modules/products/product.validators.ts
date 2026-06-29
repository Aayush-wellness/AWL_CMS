import Joi from "joi";

const ingredientSchema = Joi.object({
	name: Joi.string().max(100).required(),
	image: Joi.string().uri().allow("", null).optional(),
});

export const createProductValidator = Joi.object({
	title: Joi.string().max(200).required(),
	subLabel: Joi.string().max(100).allow(null, "").optional(),
	description: Joi.string().allow(null, "").optional(),
	categoryId: Joi.string().required(),
	image: Joi.string().allow(null, "").optional(), // main image is a file URL or path
	thumbnails: Joi.array().items(Joi.string().allow("")).optional(),
	keyBenefits: Joi.array().items(Joi.string().max(300)).optional(),
	consumerNeed: Joi.string().allow(null, "").optional(),
	ingredientsList: Joi.array().items(ingredientSchema).optional(),
	isActive: Joi.boolean().optional(),
	sortOrder: Joi.number().integer().min(0).optional(),
});

export const updateProductValidator = Joi.object({
	title: Joi.string().max(200).optional(),
	subLabel: Joi.string().max(100).allow(null, "").optional(),
	description: Joi.string().allow(null, "").optional(),
	categoryId: Joi.string().optional(),
	image: Joi.string().allow(null, "").optional(),
	thumbnails: Joi.array().items(Joi.string().allow("")).optional(),
	keyBenefits: Joi.array().items(Joi.string().max(300)).optional(),
	consumerNeed: Joi.string().allow(null, "").optional(),
	ingredientsList: Joi.array().items(ingredientSchema).optional(),
	isActive: Joi.boolean().optional(),
	sortOrder: Joi.number().integer().min(0).optional(),
}).min(1);

export const createCategoryValidator = Joi.object({
	name: Joi.string().max(100).required(),
	slug: Joi.string().max(100).pattern(/^[a-z0-9-_]+$/).optional(),
	sectionTitle: Joi.string().max(300).required(),
	sectionSubtitle: Joi.string().allow(null, "").optional(),
	isActive: Joi.boolean().optional(),
	sortOrder: Joi.number().integer().min(0).optional(),
});

export const updateCategoryValidator = Joi.object({
	name: Joi.string().max(100).optional(),
	slug: Joi.string().max(100).pattern(/^[a-z0-9-_]+$/).optional(),
	sectionTitle: Joi.string().max(300).optional(),
	sectionSubtitle: Joi.string().allow(null, "").optional(),
	isActive: Joi.boolean().optional(),
	sortOrder: Joi.number().integer().min(0).optional(),
}).min(1);

