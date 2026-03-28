const sendgridMail = require('@sendgrid/mail');

const renderBaseTemplate = ({ heading, intro, ctaLabel, ctaUrl, footerLines = [] }) => {
  const safeFooter = footerLines.map((line) => `<p style="margin:0 0 8px; color:#4b5563;">${line}</p>`).join('');
  return `
    <div style="font-family:Segoe UI, Arial, sans-serif; background:#f5f7fb; padding:24px;">
      <div style="max-width:640px; margin:0 auto; background:#ffffff; border-radius:16px; padding:32px; box-shadow:0 10px 30px rgba(15,23,42,0.08);">
        <p style="margin:0 0 12px; color:#0f766e; font-weight:700; letter-spacing:0.04em; text-transform:uppercase;">Alafia</p>
        <h1 style="margin:0 0 16px; font-size:28px; color:#0f172a;">${heading}</h1>
        <p style="margin:0 0 20px; color:#334155; line-height:1.6;">${intro}</p>
        ${ctaUrl ? `<p style="margin:0 0 24px;"><a href="${ctaUrl}" style="display:inline-block; background:#0f766e; color:#ffffff; text-decoration:none; padding:12px 18px; border-radius:10px; font-weight:600;">${ctaLabel}</a></p>` : ''}
        <div style="border-top:1px solid #e2e8f0; padding-top:16px;">${safeFooter}</div>
      </div>
    </div>
  `;
};

const getEmailConfig = () => ({
  apiKey: process.env.SENDGRID_API_KEY,
  fromEmail: process.env.SENDGRID_FROM_EMAIL,
});

const maskSecret = (value) => {
  if (!value) {
    return null;
  }

  if (value.length <= 8) {
    return '*'.repeat(value.length);
  }

  return `${value.slice(0, 4)}${'*'.repeat(value.length - 8)}${value.slice(-4)}`;
};

const isEmailConfigured = () => {
  const { apiKey, fromEmail } = getEmailConfig();
  return Boolean(apiKey && fromEmail);
};

const getEmailProviderStatus = () => {
  const { apiKey, fromEmail } = getEmailConfig();

  return {
    provider: 'sendgrid',
    configured: isEmailConfigured(),
    config: {
      fromEmail: fromEmail || null,
      apiKeyMasked: maskSecret(apiKey),
    },
  };
};

const sendEmail = async ({ to, subject, text, html }) => {
  if (!isEmailConfigured()) {
    return {
      sent: false,
      provider: 'sendgrid',
      reason: 'SendGrid is not configured',
    };
  }

  const { apiKey, fromEmail } = getEmailConfig();
  sendgridMail.setApiKey(apiKey);

  await sendgridMail.send({
    to,
    from: fromEmail,
    subject,
    text,
    html,
  });

  return {
    sent: true,
    provider: 'sendgrid',
  };
};

const sendHospitalInviteEmail = async ({ to, hospitalName, role, onboardingUrl, expiresAt }) => {
  const subject = `Invitation to join ${hospitalName} on Alafia`;
  const text = [
    `You have been invited to join ${hospitalName} on Alafia as a ${role}.`,
    `Accept your invite here: ${onboardingUrl}`,
    `This invite expires at ${new Date(expiresAt).toISOString()}.`,
  ].join('\n\n');
  const html = renderBaseTemplate({
    heading: `Join ${hospitalName} on Alafia`,
    intro: `You have been invited to join ${hospitalName} on Alafia as a ${role}.`,
    ctaLabel: 'Accept your invite',
    ctaUrl: onboardingUrl,
    footerLines: [
      `Invite expires at ${new Date(expiresAt).toISOString()}.`,
      'If you were not expecting this invitation, you can ignore this email.',
    ],
  });

  return sendEmail({ to, subject, text, html });
};

const sendWelcomeEmail = async ({ to, firstName }) => {
  const subject = 'Welcome to Alafia';
  const text = [
    `Hi ${firstName},`,
    'Welcome to Alafia. Your patient account has been created successfully.',
    'You can now use OTP login to access your health record experience.',
  ].join('\n\n');
  const html = renderBaseTemplate({
    heading: `Welcome, ${firstName}`,
    intro: 'Your Alafia patient account is ready. You can now sign in with OTP and begin managing your health records securely.',
    footerLines: [
      'Alafia helps patients own and control their medical data.',
    ],
  });

  return sendEmail({ to, subject, text, html });
};

const sendConsentStatusEmail = async ({ to, firstName, action, scope, granteeType, granteeId }) => {
  const normalizedAction = action === 'revoked' ? 'revoked' : 'granted';
  const subject = `Consent ${normalizedAction} on Alafia`;
  const text = [
    `Hi ${firstName},`,
    `You have ${normalizedAction} consent for ${granteeType} ${granteeId}.`,
    `Scope: ${scope}`,
  ].join('\n\n');
  const html = renderBaseTemplate({
    heading: `Consent ${normalizedAction}`,
    intro: `You have ${normalizedAction} consent for ${granteeType} ${granteeId}. Scope: ${scope}.`,
    footerLines: [
      'This notification was sent to confirm a permission change on your health data.',
    ],
  });

  return sendEmail({ to, subject, text, html });
};

const sendAdminTestEmail = async ({ to, requestedBy }) => {
  const subject = 'Alafia SendGrid configuration test';
  const text = [
    'This is a test email from Alafia backend.',
    `Requested by admin user: ${requestedBy}`,
    `Timestamp: ${new Date().toISOString()}`,
  ].join('\n\n');

  const html = renderBaseTemplate({
    heading: 'SendGrid test successful',
    intro: `This test email confirms SendGrid delivery is configured for Alafia. Requested by ${requestedBy}.`,
    footerLines: [
      `Timestamp: ${new Date().toISOString()}`,
    ],
  });

  return sendEmail({ to, subject, text, html });
};

module.exports = {
  sendEmail,
  isEmailConfigured,
  getEmailProviderStatus,
  sendHospitalInviteEmail,
  sendWelcomeEmail,
  sendConsentStatusEmail,
  sendAdminTestEmail,
};