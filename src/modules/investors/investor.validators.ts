import Joi from "joi";

export const createCategoryValidator = Joi.object({
  name: Joi.string().max(100).required(),
  slug: Joi.string().max(100).pattern(/^[a-z0-9]+(?:-[a-z0-9]+)*$/).optional(),
  isActive: Joi.boolean().optional(),
  sortOrder: Joi.number().integer().optional(),
});

export const updateCategoryValidator = Joi.object({
  name: Joi.string().max(100).optional(),
  slug: Joi.string().max(100).pattern(/^[a-z0-9]+(?:-[a-z0-9]+)*$/).optional(),
  isActive: Joi.boolean().optional(),
  sortOrder: Joi.number().integer().optional(),
}).min(1);

export const createDocumentValidator = Joi.object({
  name: Joi.string().max(300).required(),
  url: Joi.string().uri().required(),
  categoryId: Joi.string().required(),
});

export const updateDocumentValidator = Joi.object({
  name: Joi.string().max(300).optional(),
  url: Joi.string().uri().optional(),
  categoryId: Joi.string().optional(),
}).min(1);
