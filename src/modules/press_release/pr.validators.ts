import Joi from "joi";

const contentBlockSchema = Joi.object({
	type: Joi.string().required(),
	content: Joi.any().required(),
}).required();

export const createPressReleaseValidator = Joi.object({
	title: Joi.string().max(500).required(),
	subtitle: Joi.string().max(500).allow(null, "").optional(),
	slug: Joi.string().pattern(/^[a-z0-9]+(?:-[a-z0-9]+)*$/).required(),
	content: Joi.array().items(contentBlockSchema).min(1).required(),
	imageUrl: Joi.string().uri().allow(null, "").optional(),
	pdfUrl: Joi.string().uri().allow(null, "").optional(),
	releaseDate: Joi.date().iso().required(),
	isPublished: Joi.boolean().optional(),
});

export const updatePressReleaseValidator = Joi.object({
	title: Joi.string().max(500).optional(),
	subtitle: Joi.string().max(500).allow(null, "").optional(),
	slug: Joi.string().pattern(/^[a-z0-9]+(?:-[a-z0-9]+)*$/).optional(),
	content: Joi.array().items(contentBlockSchema).min(1).optional(),
	imageUrl: Joi.string().uri().allow(null, "").optional(),
	pdfUrl: Joi.string().uri().allow(null, "").optional(),
	releaseDate: Joi.date().iso().optional(),
	isPublished: Joi.boolean().optional(),
}).min(1);
