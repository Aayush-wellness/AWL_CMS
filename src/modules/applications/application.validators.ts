import Joi from "joi";

export const submitApplicationValidator = Joi.object({
	jobPostId: Joi.string().allow(null, "").optional(),
	fullName: Joi.string().max(200).required(),
	email: Joi.string().email().required(),
	phone: Joi.string().max(20).required(),
	location: Joi.string().max(150).required(),
	experience: Joi.string().max(50).required(),
	resumeUrl: Joi.string().uri().required(),
	coverNote: Joi.string().allow(null, "").optional(),
});

export const updateApplicationStatusValidator = Joi.object({
	status: Joi.string()
		.valid("PENDING", "UNDER_REVIEW", "SHORTLISTED", "REJECTED", "HIRED")
		.required(),
	notes: Joi.string().allow(null, "").optional(),
});
