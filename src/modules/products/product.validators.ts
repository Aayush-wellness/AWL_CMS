import Joi from "joi";

const ingredientSchema = Joi.object({
	name: Joi.string().max(100).required(),
	image: Joi.string().uri().allow("", null).optional(),
});

export const createProductValidator = Joi.object({
	title: Joi.string().max(200).required(),
	subLabel: Joi.string().max(100).allow(null, "").optional(),
	description: Joi.string().allow(null, "").optional(),
	category: Joi.string()
		.valid("WELLNESS_GUMMIES", "HEALTH_SUPPLEMENTS", "HERBAL_MASALA", "SHILAJIT_DROPS")
		.required(),
	image: Joi.string().uri().allow(null, "").optional(),
	thumbnails: Joi.array().items(Joi.string().uri().allow("")).optional(),
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
	category: Joi.string()
		.valid("WELLNESS_GUMMIES", "HEALTH_SUPPLEMENTS", "HERBAL_MASALA", "SHILAJIT_DROPS")
		.optional(),
	image: Joi.string().uri().allow(null, "").optional(),
	thumbnails: Joi.array().items(Joi.string().uri().allow("")).optional(),
	keyBenefits: Joi.array().items(Joi.string().max(300)).optional(),
	consumerNeed: Joi.string().allow(null, "").optional(),
	ingredientsList: Joi.array().items(ingredientSchema).optional(),
	isActive: Joi.boolean().optional(),
	sortOrder: Joi.number().integer().min(0).optional(),
}).min(1);
