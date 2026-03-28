const { z, uuidSchema, trimmedString } = require('./common.validator');

const validatePatientIdParams = z.object({
  id: uuidSchema,
}).strict();

const validateDiagnosis = z.object({
  code: trimmedString,
  notes: trimmedString,
}).strict();

const validatePrescription = z.object({
  name: trimmedString,
  dosage: trimmedString,
  frequency: trimmedString,
}).strict();

const validatePatientLabOrder = z.object({
  test: trimmedString,
  notes: trimmedString.optional(),
}).strict();

const validateLabOrderIdParams = z.object({
  id: uuidSchema,
}).strict();

const validateLabOrderStatusUpdate = z.object({
  status: z.enum(['pending', 'in_progress', 'completed', 'cancelled']),
}).strict();

const validateLabResultsSubmission = z.object({
  results: trimmedString,
}).strict();

module.exports = {
  validatePatientIdParams,
  validateDiagnosis,
  validatePrescription,
  validatePatientLabOrder,
  validateLabOrderIdParams,
  validateLabOrderStatusUpdate,
  validateLabResultsSubmission,
};
