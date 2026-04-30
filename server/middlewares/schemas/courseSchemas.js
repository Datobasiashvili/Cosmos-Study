const Joi = require("joi");

const HEX_COLOR = /^#([0-9a-fA-F]{3}|[0-9a-fA-F]{6})$/;

const addCourseSchema = Joi.object({
  title: Joi.string().trim().min(1).max(100).required().messages({
    "string.min": "Course title cannot be empty",
    "string.max": "Course title cannot exceed 100 characters",
    "any.required": "Course title is required",
  }),

  description: Joi.string().trim().max(500).optional().allow("").messages({
    "string.max": "Description cannot exceed 500 characters",
  }),

  color: Joi.string().pattern(HEX_COLOR).optional().default("#7c6fff").messages({
    "string.pattern.base": "Color must be a valid hex code (e.g. #7c6fff)",
  }),

  icon: Joi.string().trim().max(10).optional().default("📚"),
});

const updateCourseSchema = Joi.object({
  title: Joi.string().trim().min(1).max(100).optional().messages({
    "string.min": "Course title cannot be empty",
    "string.max": "Course title cannot exceed 100 characters",
  }),

  description: Joi.string().trim().max(500).optional().allow("").messages({
    "string.max": "Description cannot exceed 500 characters",
  }),

  color: Joi.string().pattern(HEX_COLOR).optional().messages({
    "string.pattern.base": "Color must be a valid hex code (e.g. #7c6fff)",
  }),

  icon: Joi.string().trim().max(10).optional(),

  archived: Joi.boolean().optional(),
}).min(1);


module.exports = { addCourseSchema, updateCourseSchema };