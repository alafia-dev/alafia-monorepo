const asyncHandler = require('../utils/async-handler');
const ApiError = require('../utils/api-error');
const {
  listDoctorPatients,
  createClinicalEvent,
  listStaff,
  listOnboarding,
  listLabOrders,
  updateLabOrderStatusById,
  submitLabResultsById,
} = require('../models/dashboard.model');

const getDoctorPatients = asyncHandler(async (req, res) => {
  const patients = await listDoctorPatients();
  res.status(200).json(patients);
});

const addPatientDiagnosis = asyncHandler(async (req, res) => {
  await createClinicalEvent({
    patientId: req.validatedParams.id,
    requestedBy: req.auth.sub,
    requestType: 'diagnosis',
    payload: {
      code: req.validatedBody.code,
      notes: req.validatedBody.notes,
    },
  });

  res.status(201).json({
    message: 'Diagnosis added successfully',
    diagnosis: {
      code: req.validatedBody.code,
      notes: req.validatedBody.notes,
    },
  });
});

const addPatientPrescription = asyncHandler(async (req, res) => {
  await createClinicalEvent({
    patientId: req.validatedParams.id,
    requestedBy: req.auth.sub,
    requestType: 'prescription',
    payload: {
      name: req.validatedBody.name,
      dosage: req.validatedBody.dosage,
      frequency: req.validatedBody.frequency,
    },
  });

  res.status(201).json({
    message: 'Prescription issued successfully',
    prescription: {
      name: req.validatedBody.name,
      dosage: req.validatedBody.dosage,
      frequency: req.validatedBody.frequency,
    },
  });
});

const createPatientLabOrder = asyncHandler(async (req, res) => {
  await createClinicalEvent({
    patientId: req.validatedParams.id,
    requestedBy: req.auth.sub,
    requestType: 'lab_order',
    payload: {
      test: req.validatedBody.test,
      notes: req.validatedBody.notes,
    },
  });

  res.status(201).json({
    message: 'Lab order created successfully',
    labOrder: {
      test: req.validatedBody.test,
      notes: req.validatedBody.notes,
    },
  });
});

const getAdminStaff = asyncHandler(async (req, res) => {
  const staff = await listStaff();
  res.status(200).json(
    staff.map((member) => ({
      id: member.id,
      name: `${member.first_name} ${member.last_name}`,
      role: member.role,
      status: member.is_active ? 'Active' : 'Inactive',
    }))
  );
});

const getAdminOnboarding = asyncHandler(async (req, res) => {
  const onboarding = await listOnboarding();
  res.status(200).json(
    onboarding.map((item) => ({
      id: item.id,
      name: item.name,
      status: item.status,
    }))
  );
});

const getLabOrders = asyncHandler(async (req, res) => {
  const orders = await listLabOrders();
  res.status(200).json(
    orders.map((order) => ({
      id: order.id,
      patient: order.patient,
      test: order.test,
      status: order.status,
    }))
  );
});

const updateLabOrderStatus = asyncHandler(async (req, res) => {
  const updated = await updateLabOrderStatusById(req.validatedParams.id, req.validatedBody.status);
  if (!updated) {
    throw new ApiError(404, 'Lab order not found');
  }

  res.status(200).json({
    message: 'Lab order status updated successfully',
    status: updated.status,
  });
});

const submitLabResults = asyncHandler(async (req, res) => {
  const updated = await submitLabResultsById(req.validatedParams.id, req.validatedBody.results);
  if (!updated) {
    throw new ApiError(404, 'Lab order not found');
  }

  res.status(201).json({
    message: 'Lab results submitted successfully',
    results: req.validatedBody.results,
  });
});

module.exports = {
  getDoctorPatients,
  addPatientDiagnosis,
  addPatientPrescription,
  createPatientLabOrder,
  getAdminStaff,
  getAdminOnboarding,
  getLabOrders,
  updateLabOrderStatus,
  submitLabResults,
};
