const Joi = require("joi");

const startSessionSchema = Joi.object({
  description: Joi.string().trim().max(1000).optional().allow(""),
  // pomodoroSettings: Joi.object({
  //   focusDuration:         Joi.number().min(1).max(120),
  //   shortBreak:            Joi.number().min(1).max(60),
  //   longBreak:             Joi.number().min(1).max(120),
  //   cyclesBeforeLongBreak: Joi.number().min(1).max(10),
  //   autoStartBreaks:       Joi.boolean(),
  //   autoStartFocus:        Joi.boolean(),
  // }).optional(),
});

const completeSessionSchema = Joi.object({
  duration: Joi.number().min(1).max(600).required().messages({
    "number.min":   "Session duration must be at least 1 minute",
    "number.max":   "Session duration cannot exceed 10 hours",
    "any.required": "Duration is required to complete a session",
  }),
});

module.exports = { startSessionSchema, completeSessionSchema };