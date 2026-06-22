import Joi from "joi";

export const createJobValidator = Joi.object({
	title: Joi.string().max(200).required(),
	department: Joi.string().max(100).required(),
	location: Joi.string().max(150).required(),
	type: Joi.string()
		.valid("FULL_TIME", "PART_TIME", "CONTRACT", "INTERNSHIP")
		.optional(),
	experience: Joi.string().max(50).required(),
	description: Joi.string().allow(null, "").optional(),
	status: Joi.string().valid("DRAFT", "PUBLISHED", "CLOSED").optional(),
});

export const updateJobValidator = Joi.object({
	title: Joi.string().max(200).optional(),
	department: Joi.string().max(100).optional(),
	location: Joi.string().max(150).optional(),
	type: Joi.string()
		.valid("FULL_TIME", "PART_TIME", "CONTRACT", "INTERNSHIP")
		.optional(),
	experience: Joi.string().max(50).optional(),
	description: Joi.string().allow(null, "").optional(),
	status: Joi.string().valid("DRAFT", "PUBLISHED", "CLOSED").optional(),
}).min(1);
