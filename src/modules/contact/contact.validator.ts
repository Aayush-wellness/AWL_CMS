import Joi from "joi";

export const submitContactValidator = Joi.object({
	fullName: Joi.string().max(200).required(),
	email: Joi.string().email().required(),
	phoneNo: Joi.string().max(20).allow(null, "").optional(),
	company: Joi.string().max(200).allow(null, "").optional(),
	inquiryType: Joi.string().max(100).allow(null, "").optional(),
	message: Joi.string().min(10).required(),
});
