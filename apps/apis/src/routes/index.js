const express = require('express');

const healthRoutes = require('./health.routes');
const authRoutes = require('./auth.routes');
const hospitalsRoutes = require('./hospitals.routes');
const patientsRoutes = require('./patients.routes');
const subscriptionsRoutes = require('./subscriptions.routes');
const didRoutes = require('./did.routes');
const consentsRoutes = require('./consents.routes');
const integrationsRoutes = require('./integrations.routes');
const adminRoutes = require('./admin.routes');
const doctorRoutes = require('./doctor.routes');
const labRoutes = require('./lab.routes');

const router = express.Router();

router.use('/health', healthRoutes);
router.use('/auth', authRoutes);
router.use('/hospitals', hospitalsRoutes);
router.use('/patients', patientsRoutes);
router.use('/subscriptions', subscriptionsRoutes);
router.use('/did', didRoutes);
router.use('/consents', consentsRoutes);
router.use('/integrations', integrationsRoutes);
router.use('/admin', adminRoutes);
router.use('/doctor', doctorRoutes);
router.use('/lab', labRoutes);

module.exports = router;
