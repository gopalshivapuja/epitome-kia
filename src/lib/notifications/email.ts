import { Resend } from 'resend'

const resend = process.env.RESEND_API_KEY
  ? new Resend(process.env.RESEND_API_KEY)
  : null

interface PriceAlertEmailParams {
  to: string
  modelName: string
  modelSlug: string
  oldPrice: string
  newPrice: string
  percentageOff: number
}

export async function sendPriceDropEmail({
  to,
  modelName,
  modelSlug,
  oldPrice,
  newPrice,
  percentageOff,
}: PriceAlertEmailParams) {
  if (!resend) {
    console.warn('Resend not configured, skipping email')
    return null
  }

  try {
    const result = await resend.emails.send({
      from: 'Epitome Kia <alerts@epitomekia.com>',
      to,
      subject: `Price Drop Alert: ${modelName} now ${percentageOff}% off!`,
      html: `
        <!DOCTYPE html>
        <html>
          <head>
            <meta charset="utf-8">
            <title>Price Drop Alert</title>
          </head>
          <body style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif; line-height: 1.6; color: #333; max-width: 600px; margin: 0 auto; padding: 20px;">
            <div style="text-align: center; margin-bottom: 30px;">
              <h1 style="color: #BB162B; margin: 0;">EPITOME</h1>
              <p style="color: #666; font-size: 14px; margin: 5px 0;">Authorized Kia Dealer</p>
            </div>

            <div style="background: linear-gradient(135deg, #BB162B 0%, #8B1120 100%); color: white; padding: 30px; border-radius: 12px; text-align: center; margin-bottom: 30px;">
              <h2 style="margin: 0 0 10px 0; font-size: 28px;">Price Drop Alert!</h2>
              <p style="margin: 0; opacity: 0.9;">Great news! The ${modelName} is now more affordable.</p>
            </div>

            <div style="background: #f8f9fa; padding: 25px; border-radius: 12px; margin-bottom: 30px;">
              <h3 style="margin: 0 0 20px 0; color: #333;">Kia ${modelName}</h3>

              <div style="display: flex; justify-content: space-between; margin-bottom: 15px;">
                <div>
                  <p style="color: #666; font-size: 14px; margin: 0;">Was</p>
                  <p style="font-size: 20px; color: #999; text-decoration: line-through; margin: 5px 0;">${oldPrice}</p>
                </div>
                <div>
                  <p style="color: #666; font-size: 14px; margin: 0;">Now</p>
                  <p style="font-size: 24px; color: #BB162B; font-weight: bold; margin: 5px 0;">${newPrice}</p>
                </div>
              </div>

              <div style="background: #10b981; color: white; padding: 8px 16px; border-radius: 20px; display: inline-block; font-weight: bold;">
                ${percentageOff}% OFF
              </div>
            </div>

            <div style="text-align: center; margin-bottom: 30px;">
              <a href="https://epitomekia.com/models/${modelSlug}"
                 style="background: #BB162B; color: white; padding: 14px 32px; text-decoration: none; border-radius: 8px; font-weight: 600; display: inline-block;">
                View ${modelName}
              </a>
            </div>

            <div style="text-align: center; margin-bottom: 30px;">
              <a href="https://epitomekia.com/test-drive?model=${modelSlug}"
                 style="color: #BB162B; text-decoration: none; font-weight: 500;">
                Book a Test Drive
              </a>
            </div>

            <hr style="border: none; border-top: 1px solid #eee; margin: 30px 0;">

            <div style="text-align: center; color: #999; font-size: 12px;">
              <p>Epitome Kia | Authorized Kia Dealer in Bangalore</p>
              <p>Sales: 08047363737 | Service: 08047363838</p>
              <p style="margin-top: 15px;">
                <a href="https://epitomekia.com/unsubscribe?email=${encodeURIComponent(to)}"
                   style="color: #999;">Unsubscribe from alerts</a>
              </p>
            </div>
          </body>
        </html>
      `,
    })
    return result
  } catch (error) {
    console.error('Failed to send price alert email:', error)
    return null
  }
}

interface NewOfferEmailParams {
  to: string
  offerTitle: string
  offerDescription: string
  modelName?: string
  modelSlug?: string
  validUntil?: string
}

export async function sendNewOfferEmail({
  to,
  offerTitle,
  offerDescription,
  modelName,
  modelSlug,
  validUntil,
}: NewOfferEmailParams) {
  if (!resend) {
    console.warn('Resend not configured, skipping email')
    return null
  }

  try {
    const result = await resend.emails.send({
      from: 'Epitome Kia <alerts@epitomekia.com>',
      to,
      subject: `New Offer: ${offerTitle}`,
      html: `
        <!DOCTYPE html>
        <html>
          <head>
            <meta charset="utf-8">
            <title>New Offer</title>
          </head>
          <body style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif; line-height: 1.6; color: #333; max-width: 600px; margin: 0 auto; padding: 20px;">
            <div style="text-align: center; margin-bottom: 30px;">
              <h1 style="color: #BB162B; margin: 0;">EPITOME</h1>
              <p style="color: #666; font-size: 14px; margin: 5px 0;">Authorized Kia Dealer</p>
            </div>

            <div style="background: linear-gradient(135deg, #BB162B 0%, #8B1120 100%); color: white; padding: 30px; border-radius: 12px; text-align: center; margin-bottom: 30px;">
              <h2 style="margin: 0 0 10px 0; font-size: 24px;">${offerTitle}</h2>
              ${modelName ? `<p style="margin: 0; opacity: 0.9;">For Kia ${modelName}</p>` : ''}
            </div>

            <div style="background: #f8f9fa; padding: 25px; border-radius: 12px; margin-bottom: 30px;">
              <p style="margin: 0; color: #555;">${offerDescription}</p>
              ${validUntil ? `<p style="margin: 15px 0 0 0; color: #BB162B; font-weight: 500;">Valid until: ${validUntil}</p>` : ''}
            </div>

            <div style="text-align: center; margin-bottom: 30px;">
              <a href="https://epitomekia.com/offers"
                 style="background: #BB162B; color: white; padding: 14px 32px; text-decoration: none; border-radius: 8px; font-weight: 600; display: inline-block;">
                View All Offers
              </a>
            </div>

            <hr style="border: none; border-top: 1px solid #eee; margin: 30px 0;">

            <div style="text-align: center; color: #999; font-size: 12px;">
              <p>Epitome Kia | Authorized Kia Dealer in Bangalore</p>
              <p>Sales: 08047363737 | Service: 08047363838</p>
              <p style="margin-top: 15px;">
                <a href="https://epitomekia.com/unsubscribe?email=${encodeURIComponent(to)}"
                   style="color: #999;">Unsubscribe from alerts</a>
              </p>
            </div>
          </body>
        </html>
      `,
    })
    return result
  } catch (error) {
    console.error('Failed to send new offer email:', error)
    return null
  }
}

interface AvailabilityEmailParams {
  to: string
  modelName: string
  modelSlug: string
}

export async function sendAvailabilityEmail({
  to,
  modelName,
  modelSlug,
}: AvailabilityEmailParams) {
  if (!resend) {
    console.warn('Resend not configured, skipping email')
    return null
  }

  try {
    const result = await resend.emails.send({
      from: 'Epitome Kia <alerts@epitomekia.com>',
      to,
      subject: `The Kia ${modelName} is now available!`,
      html: `
        <!DOCTYPE html>
        <html>
          <head>
            <meta charset="utf-8">
            <title>Now Available</title>
          </head>
          <body style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif; line-height: 1.6; color: #333; max-width: 600px; margin: 0 auto; padding: 20px;">
            <div style="text-align: center; margin-bottom: 30px;">
              <h1 style="color: #BB162B; margin: 0;">EPITOME</h1>
              <p style="color: #666; font-size: 14px; margin: 5px 0;">Authorized Kia Dealer</p>
            </div>

            <div style="background: linear-gradient(135deg, #BB162B 0%, #8B1120 100%); color: white; padding: 30px; border-radius: 12px; text-align: center; margin-bottom: 30px;">
              <h2 style="margin: 0 0 10px 0; font-size: 28px;">Now Available!</h2>
              <p style="margin: 0; font-size: 20px;">Kia ${modelName}</p>
            </div>

            <div style="background: #f8f9fa; padding: 25px; border-radius: 12px; margin-bottom: 30px; text-align: center;">
              <p style="margin: 0; color: #555; font-size: 16px;">
                Great news! The Kia ${modelName} you were waiting for is now available at our showroom.
              </p>
              <p style="margin: 15px 0 0 0; color: #333;">
                Book a test drive today and experience the ${modelName} in person!
              </p>
            </div>

            <div style="text-align: center; margin-bottom: 20px;">
              <a href="https://epitomekia.com/models/${modelSlug}"
                 style="background: #BB162B; color: white; padding: 14px 32px; text-decoration: none; border-radius: 8px; font-weight: 600; display: inline-block;">
                Explore ${modelName}
              </a>
            </div>

            <div style="text-align: center; margin-bottom: 30px;">
              <a href="https://epitomekia.com/test-drive?model=${modelSlug}"
                 style="color: #BB162B; text-decoration: none; font-weight: 500;">
                Book Test Drive
              </a>
            </div>

            <hr style="border: none; border-top: 1px solid #eee; margin: 30px 0;">

            <div style="text-align: center; color: #999; font-size: 12px;">
              <p>Epitome Kia | Authorized Kia Dealer in Bangalore</p>
              <p>Sales: 08047363737 | Service: 08047363838</p>
              <p style="margin-top: 15px;">
                <a href="https://epitomekia.com/unsubscribe?email=${encodeURIComponent(to)}"
                   style="color: #999;">Unsubscribe from alerts</a>
              </p>
            </div>
          </body>
        </html>
      `,
    })
    return result
  } catch (error) {
    console.error('Failed to send availability email:', error)
    return null
  }
}
