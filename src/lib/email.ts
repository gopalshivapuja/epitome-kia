import { Resend } from 'resend'

// Lazy initialization to avoid build-time errors
let resend: Resend | null = null

function getResend(): Resend | null {
  if (!process.env.RESEND_API_KEY) {
    return null
  }
  if (!resend) {
    resend = new Resend(process.env.RESEND_API_KEY)
  }
  return resend
}

const FROM_EMAIL = process.env.EMAIL_FROM || 'Epitome Kia <noreply@epitomekia.com>'
const SALES_EMAIL = process.env.EMAIL_SALES_TEAM || 'sales@epitomekia.com'
const SERVICE_EMAIL = process.env.EMAIL_SERVICE_TEAM || 'service@epitomekia.com'

interface TestDriveEmailData {
  customerName: string
  customerEmail: string
  customerPhone: string
  modelName: string
  variantName?: string
  preferredDate: string
  preferredTime: string
}

interface ServiceBookingEmailData {
  customerName: string
  customerEmail: string
  customerPhone: string
  serviceType: string
  vehicleModel: string
  vehicleRegNumber?: string
  preferredDate: string
  preferredTime: string
}

interface LeadEmailData {
  customerName: string
  customerEmail: string
  customerPhone?: string
  subject: string
  message: string
  source: string
}

// Send test drive confirmation to customer
export async function sendTestDriveConfirmation(data: TestDriveEmailData) {
  const client = getResend()
  if (!client) {
    console.log('RESEND_API_KEY not set, skipping email')
    return { success: true, skipped: true }
  }

  try {
    const result = await client.emails.send({
      from: FROM_EMAIL,
      to: data.customerEmail,
      subject: `Test Drive Confirmed - ${data.modelName}`,
      html: `
        <!DOCTYPE html>
        <html>
        <head>
          <style>
            body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
            .container { max-width: 600px; margin: 0 auto; padding: 20px; }
            .header { background: #05141F; color: white; padding: 20px; text-align: center; }
            .header h1 { margin: 0; }
            .header span { color: #BB162B; }
            .content { padding: 20px; background: #f9f9f9; }
            .details { background: white; padding: 15px; border-radius: 8px; margin: 15px 0; }
            .details h3 { margin-top: 0; color: #05141F; }
            .detail-row { display: flex; justify-content: space-between; padding: 8px 0; border-bottom: 1px solid #eee; }
            .detail-label { color: #666; }
            .detail-value { font-weight: bold; }
            .footer { text-align: center; padding: 20px; color: #666; font-size: 12px; }
          </style>
        </head>
        <body>
          <div class="container">
            <div class="header">
              <h1>Epitome <span>Kia</span></h1>
            </div>
            <div class="content">
              <h2>Test Drive Confirmed!</h2>
              <p>Dear ${data.customerName},</p>
              <p>Thank you for booking a test drive with Epitome Kia. We're excited to have you experience the ${data.modelName}!</p>

              <div class="details">
                <h3>Booking Details</h3>
                <div class="detail-row">
                  <span class="detail-label">Model</span>
                  <span class="detail-value">${data.modelName}${data.variantName ? ` - ${data.variantName}` : ''}</span>
                </div>
                <div class="detail-row">
                  <span class="detail-label">Date</span>
                  <span class="detail-value">${data.preferredDate}</span>
                </div>
                <div class="detail-row">
                  <span class="detail-label">Time</span>
                  <span class="detail-value">${data.preferredTime}</span>
                </div>
              </div>

              <p>Our team will contact you shortly to confirm the appointment. Please bring a valid driving license.</p>

              <p>If you need to reschedule, please contact us at: <strong>080-4736-3737</strong></p>
            </div>
            <div class="footer">
              <p>Epitome Kia | Your Premium Kia Dealer</p>
              <p>This is an automated message. Please do not reply directly.</p>
            </div>
          </div>
        </body>
        </html>
      `,
    })
    return { success: true, id: result.data?.id }
  } catch (error) {
    console.error('Failed to send test drive confirmation:', error)
    return { success: false, error }
  }
}

// Send service booking confirmation to customer
export async function sendServiceBookingConfirmation(data: ServiceBookingEmailData) {
  const client = getResend()
  if (!client) {
    console.log('RESEND_API_KEY not set, skipping email')
    return { success: true, skipped: true }
  }

  try {
    const result = await client.emails.send({
      from: FROM_EMAIL,
      to: data.customerEmail,
      subject: `Service Appointment Confirmed - ${data.serviceType}`,
      html: `
        <!DOCTYPE html>
        <html>
        <head>
          <style>
            body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
            .container { max-width: 600px; margin: 0 auto; padding: 20px; }
            .header { background: #05141F; color: white; padding: 20px; text-align: center; }
            .header h1 { margin: 0; }
            .header span { color: #BB162B; }
            .content { padding: 20px; background: #f9f9f9; }
            .details { background: white; padding: 15px; border-radius: 8px; margin: 15px 0; }
            .details h3 { margin-top: 0; color: #05141F; }
            .detail-row { display: flex; justify-content: space-between; padding: 8px 0; border-bottom: 1px solid #eee; }
            .detail-label { color: #666; }
            .detail-value { font-weight: bold; }
            .footer { text-align: center; padding: 20px; color: #666; font-size: 12px; }
          </style>
        </head>
        <body>
          <div class="container">
            <div class="header">
              <h1>Epitome <span>Kia</span></h1>
            </div>
            <div class="content">
              <h2>Service Appointment Confirmed!</h2>
              <p>Dear ${data.customerName},</p>
              <p>Your service appointment has been scheduled. We look forward to serving you!</p>

              <div class="details">
                <h3>Appointment Details</h3>
                <div class="detail-row">
                  <span class="detail-label">Service Type</span>
                  <span class="detail-value">${data.serviceType}</span>
                </div>
                <div class="detail-row">
                  <span class="detail-label">Vehicle</span>
                  <span class="detail-value">${data.vehicleModel}${data.vehicleRegNumber ? ` (${data.vehicleRegNumber})` : ''}</span>
                </div>
                <div class="detail-row">
                  <span class="detail-label">Date</span>
                  <span class="detail-value">${data.preferredDate}</span>
                </div>
                <div class="detail-row">
                  <span class="detail-label">Time</span>
                  <span class="detail-value">${data.preferredTime}</span>
                </div>
              </div>

              <p>Please arrive 10 minutes before your scheduled time. Bring your vehicle registration and service history if available.</p>
            </div>
            <div class="footer">
              <p>Epitome Kia Service Center</p>
              <p>This is an automated message. Please do not reply directly.</p>
            </div>
          </div>
        </body>
        </html>
      `,
    })
    return { success: true, id: result.data?.id }
  } catch (error) {
    console.error('Failed to send service booking confirmation:', error)
    return { success: false, error }
  }
}

// Notify sales team of new lead
export async function notifySalesTeam(data: LeadEmailData) {
  const client = getResend()
  if (!client) {
    console.log('RESEND_API_KEY not set, skipping email')
    return { success: true, skipped: true }
  }

  try {
    const result = await client.emails.send({
      from: FROM_EMAIL,
      to: SALES_EMAIL,
      subject: `New Lead: ${data.customerName} - ${data.subject}`,
      html: `
        <!DOCTYPE html>
        <html>
        <head>
          <style>
            body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
            .container { max-width: 600px; margin: 0 auto; padding: 20px; }
            .header { background: #BB162B; color: white; padding: 15px; }
            .content { padding: 20px; background: #f9f9f9; }
            .details { background: white; padding: 15px; border-radius: 8px; }
            .detail-row { padding: 8px 0; border-bottom: 1px solid #eee; }
            .label { color: #666; font-size: 12px; text-transform: uppercase; }
            .value { font-weight: bold; margin-top: 4px; }
            .message { background: #fff; padding: 15px; border-left: 4px solid #BB162B; margin-top: 15px; }
            .cta { background: #05141F; color: white; padding: 12px 24px; text-decoration: none; display: inline-block; margin-top: 15px; border-radius: 4px; }
          </style>
        </head>
        <body>
          <div class="container">
            <div class="header">
              <h2 style="margin:0;">🚨 New Lead Alert</h2>
            </div>
            <div class="content">
              <div class="details">
                <div class="detail-row">
                  <div class="label">Customer Name</div>
                  <div class="value">${data.customerName}</div>
                </div>
                <div class="detail-row">
                  <div class="label">Email</div>
                  <div class="value">${data.customerEmail}</div>
                </div>
                ${data.customerPhone ? `
                <div class="detail-row">
                  <div class="label">Phone</div>
                  <div class="value">${data.customerPhone}</div>
                </div>
                ` : ''}
                <div class="detail-row">
                  <div class="label">Subject</div>
                  <div class="value">${data.subject}</div>
                </div>
                <div class="detail-row">
                  <div class="label">Source</div>
                  <div class="value">${data.source}</div>
                </div>
              </div>

              <div class="message">
                <div class="label">Message</div>
                <p>${data.message}</p>
              </div>

              <a href="${process.env.NEXTAUTH_URL || 'http://localhost:3000'}/admin/leads" class="cta">
                View in Dashboard →
              </a>
            </div>
          </div>
        </body>
        </html>
      `,
    })
    return { success: true, id: result.data?.id }
  } catch (error) {
    console.error('Failed to notify sales team:', error)
    return { success: false, error }
  }
}

// Notify service team of new booking
export async function notifyServiceTeam(data: ServiceBookingEmailData) {
  const client = getResend()
  if (!client) {
    console.log('RESEND_API_KEY not set, skipping email')
    return { success: true, skipped: true }
  }

  try {
    const result = await client.emails.send({
      from: FROM_EMAIL,
      to: SERVICE_EMAIL,
      subject: `New Service Booking: ${data.customerName} - ${data.serviceType}`,
      html: `
        <!DOCTYPE html>
        <html>
        <head>
          <style>
            body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
            .container { max-width: 600px; margin: 0 auto; padding: 20px; }
            .header { background: #05141F; color: white; padding: 15px; }
            .content { padding: 20px; background: #f9f9f9; }
            .details { background: white; padding: 15px; border-radius: 8px; }
            .detail-row { padding: 8px 0; border-bottom: 1px solid #eee; }
            .label { color: #666; font-size: 12px; text-transform: uppercase; }
            .value { font-weight: bold; margin-top: 4px; }
            .highlight { background: #BB162B; color: white; padding: 10px; text-align: center; margin-top: 15px; border-radius: 4px; }
          </style>
        </head>
        <body>
          <div class="container">
            <div class="header">
              <h2 style="margin:0;">🔧 New Service Booking</h2>
            </div>
            <div class="content">
              <div class="highlight">
                <strong>${data.preferredDate} at ${data.preferredTime}</strong>
              </div>

              <div class="details" style="margin-top: 15px;">
                <div class="detail-row">
                  <div class="label">Customer</div>
                  <div class="value">${data.customerName}</div>
                </div>
                <div class="detail-row">
                  <div class="label">Phone</div>
                  <div class="value">${data.customerPhone}</div>
                </div>
                <div class="detail-row">
                  <div class="label">Email</div>
                  <div class="value">${data.customerEmail}</div>
                </div>
                <div class="detail-row">
                  <div class="label">Service Type</div>
                  <div class="value">${data.serviceType}</div>
                </div>
                <div class="detail-row">
                  <div class="label">Vehicle</div>
                  <div class="value">${data.vehicleModel} ${data.vehicleRegNumber ? `(${data.vehicleRegNumber})` : ''}</div>
                </div>
              </div>
            </div>
          </div>
        </body>
        </html>
      `,
    })
    return { success: true, id: result.data?.id }
  } catch (error) {
    console.error('Failed to notify service team:', error)
    return { success: false, error }
  }
}
