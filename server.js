require('dotenv').config();
const express = require('express');
const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);
const cors = require('cors');

const app = express();
app.use(cors());
app.use(express.static('.')); // Serve static files (html, css, js)
app.use(express.json());

const DOMAIN = process.env.DOMAIN || 'https://protech-solutions.onrender.com';

app.post('/create-checkout-session', async (req, res) => {
    try {
        const cartItems = req.body.cart;

        if (!cartItems || cartItems.length === 0) {
            return res.status(400).json({ error: 'Cart is empty' });
        }

        const lineItems = cartItems.map(item => ({
            price_data: {
                currency: 'eur',
                product_data: {
                    name: item.title,
                    images: [item.image], // Stripe expects a valid URL
                    description: item.desc || item.material
                },
                unit_amount: Math.round(item.price * 100), // Stripe expects cents
            },
            quantity: item.qty,
        }));

        // Shipping Options Logic
        const totalAmount = cartItems.reduce((acc, item) => acc + (item.price * item.qty), 0);

        const shippingOptions = [
            {
                shipping_rate_data: {
                    type: 'fixed_amount',
                    fixed_amount: { amount: 0, currency: 'eur' },
                    display_name: 'Store Pickup',
                    delivery_estimate: {
                        minimum: { unit: 'business_day', value: 1 },
                        maximum: { unit: 'business_day', value: 2 },
                    },
                },
            }
        ];

        const standardShippingRate = totalAmount >= 599.99 ? 0 : 10000; // 100€ if < 599.99
        shippingOptions.push({
            shipping_rate_data: {
                type: 'fixed_amount',
                fixed_amount: { amount: standardShippingRate, currency: 'eur' },
                display_name: totalAmount >= 599.99 ? 'Free Delivery (Promo)' : 'Standard Delivery',
                delivery_estimate: {
                    minimum: { unit: 'business_day', value: 3 },
                    maximum: { unit: 'business_day', value: 5 },
                },
            },
        });

        const session = await stripe.checkout.sessions.create({
            payment_method_types: ['card'],
            line_items: lineItems,
            mode: 'payment',
            shipping_address_collection: {
                allowed_countries: ['ES', 'BE', 'FR', 'NL', 'DE', 'GB', 'CA', 'US'],
            },
            shipping_options: shippingOptions,
            success_url: `${DOMAIN}/index.html?success=true&session_id={CHECKOUT_SESSION_ID}`,
            cancel_url: `${DOMAIN}/index.html?canceled=true`,
        });

        res.json({ url: session.url });
    } catch (error) {
        console.error("Stripe Error:", error);
        res.status(500).json({ error: error.message });
    }
});

// Email Notification Setup
const nodemailer = require('nodemailer');
const transporter = nodemailer.createTransport({
    host: process.env.EMAIL_HOST || 'smtp.ethereal.email',
    port: process.env.EMAIL_PORT || 587,
    auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS
    }
});

// Webhook for Order Notifications
// NOTE: For local dev without Stripe CLI, this webhook won't receive events from real Stripe.
// We would need to use Stripe CLI to forward events: `stripe listen --forward-to localhost:4242/webhook`
app.post('/webhook', express.raw({ type: 'application/json' }), async (request, response) => {
    const event = request.body;
    // In a real app, verify signature here using stripe.webhooks.constructEvent

    if (event.type === 'checkout.session.completed') {
        const session = event.data.object;
        const customerEmail = session.customer_details.email;
        const amountTotal = session.amount_total / 100;
        const shippingCost = session.total_details.amount_shipping / 100;

        console.log(`Payment success for session ID: ${session.id}`);
        await sendOrderEmail(session);
        await sendCustomerEmail(session);
    }
    response.json({ received: true });
});

// Helper function to send professional HTML email
async function sendOrderEmail(session) {
    const amountTotal = session.amount_total / 100;
    const shippingCost = session.total_details?.amount_shipping / 100 || 0;
    const orderId = session.id.slice(-8).toUpperCase();

    const mailOptions = {
        from: `"ProTech Solutions Orders" <${process.env.EMAIL_USER}>`,
        to: 'protechtsolutions.orders@gmail.com',
        subject: `[SALES] New Order #${orderId} - ProTech Solutions`,
        html: `
        <div style="font-family: 'Helvetica Neue', Helvetica, Arial, sans-serif; max-width: 600px; margin: 0 auto; border: 1px solid #eee; border-radius: 10px; overflow: hidden; color: #333;">
            <div style="background-color: #111827; padding: 30px; text-align: center;">
                <h1 style="color: #ffffff; margin: 0; font-size: 24px; letter-spacing: 1px;">PROTECH SOLUTIONS</h1>
            </div>
            <div style="padding: 40px;">
                <h2 style="margin-top: 0; color: #111827;">New Order Received!</h2>
                <p style="font-size: 16px; color: #666;">You have a new order confirmation for your kitchen backsplash project.</p>
                
                <div style="background-color: #f9fafb; border-radius: 8px; padding: 20px; margin: 30px 0;">
                    <table style="width: 100%; border-collapse: collapse;">
                        <tr>
                            <td style="padding-bottom: 20px;">
                                <strong style="display: block; font-size: 12px; color: #9ca3af; text-transform: uppercase; margin-bottom: 5px;">Order ID</strong>
                                <span style="font-weight: 600;">#${orderId}</span>
                            </td>
                            <td style="padding-bottom: 20px; text-align: right;">
                                <strong style="display: block; font-size: 12px; color: #9ca3af; text-transform: uppercase; margin-bottom: 5px;">Payment Status</strong>
                                <span style="color: #059669; font-weight: 600; background-color: #ecfdf5; padding: 4px 12px; border-radius: 20px;">Paid</span>
                            </td>
                        </tr>
                    </table>
                </div>

                <h3 style="border-bottom: 1px solid #eee; padding-bottom: 10px; margin-bottom: 20px;">Order Summary</h3>
                <table style="width: 100%; margin-bottom: 30px;">
                    <tr>
                        <td style="width: 80px; padding-right: 20px;">
                            <img src="https://images.unsplash.com/photo-1556911220-e15023918c39?auto=format&fit=crop&q=80&w=200" alt="Product" style="width: 80px; height: 80px; object-fit: cover; border-radius: 8px; background: #f3f4f6;">
                        </td>
                        <td>
                            <p style="margin: 0; font-weight: 600; font-size: 16px;">Professional AISI 304 Stainless Steel Sheet</p>
                            <p style="margin: 5px 0 0 0; color: #6b7280; font-size: 14px;">1 Side Brushed / 1 Side Polished Mirror</p>
                        </td>
                        <td style="text-align: right; vertical-align: top;">
                            <span style="font-weight: 600;">€${amountTotal.toFixed(2)}</span>
                        </td>
                    </tr>
                </table>

                <div style="border-top: 1px solid #eee; padding-top: 20px;">
                    <table style="width: 100%;">
                        <tr>
                            <td style="color: #666;">Standard Delivery</td>
                            <td style="text-align: right; font-weight: 600;">€${shippingCost.toFixed(2)}</td>
                        </tr>
                        <tr>
                            <td style="padding-top: 10px; font-size: 18px; font-weight: bold; color: #111827;">Total Amount</td>
                            <td style="padding-top: 10px; text-align: right; font-size: 18px; font-weight: bold; color: #4f46e5;">€${amountTotal.toFixed(2)}</td>
                        </tr>
                    </table>
                </div>

                <div style="margin-top: 40px;">
                    <h3 style="border-bottom: 1px solid #eee; padding-bottom: 10px; margin-bottom: 15px;">Shipping Address</h3>
                    <p style="margin: 0; color: #4b5563; line-height: 1.6;">
                        <strong>${session.shipping_details?.name || session.customer_details.name}</strong><br>
                        ${session.shipping_details?.address?.line1 || 'N/A'}<br>
                        ${session.shipping_details?.address?.city || ''}, ${session.shipping_details?.address?.state || ''} ${session.shipping_details?.address?.postal_code || ''}<br>
                        ${session.shipping_details?.address?.country || ''}
                    </p>
                </div>
            </div>
            <div style="background-color: #f9fafb; padding: 20px; text-align: center; color: #9ca3af; font-size: 12px;">
                <p style="margin: 0;">&copy; 2026 ProTech Solutions. All rights reserved.</p>
                <p style="margin: 5px 0 0 0;">This is an automated order notification.</p>
            </div>
        </div>
        `
    };

    try {
        await transporter.sendMail(mailOptions);
        console.log(`Order notification email sent for session: ${session.id}`);
    } catch (error) {
        console.error('Error sending email:', error);
    }
}

async function sendCustomerEmail(session) {
    const customerEmail = session.customer_details.email;
    const customerName = session.customer_details.name || 'Customer';
    const amountTotal = session.amount_total / 100;
    const orderId = session.id.slice(-8).toUpperCase();

    const mailOptions = {
        from: `"ProTech Solutions" <${process.env.EMAIL_USER}>`,
        to: customerEmail,
        subject: `Order Confirmed - ProTech Solutions #${orderId}`,
        html: `
        <div style="font-family: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; max-width: 600px; margin: 0 auto; border: 1px solid #f0f0f0; border-radius: 16px; overflow: hidden; background-color: #ffffff;">
            <div style="background-color: #000000; padding: 40px 20px; text-align: center;">
                <h1 style="color: #ffffff; margin: 0; font-size: 28px; font-weight: 500; letter-spacing: -0.02em;">PROTECH SOLUTIONS</h1>
                <p style="color: #888; margin-top: 10px; font-size: 14px;">Your professional kitchen upgrade is on its way.</p>
            </div>
            
            <div style="padding: 40px 30px;">
                <h2 style="font-size: 22px; margin-top: 0; color: #111;">Hi ${customerName},</h2>
                <p style="font-size: 16px; line-height: 1.6; color: #444;">Thank you for your order. We are excited to help you transform your kitchen space with professional-grade stainless steel.</p>

                <div style="margin: 30px 0; padding: 25px; background: #fafafa; border-radius: 12px;">
                    <table style="width: 100%;">
                        <tr>
                            <td><span style="color: #888; font-size: 12px; text-transform: uppercase;">Order Number</span></td>
                            <td style="text-align: right;"><span style="color: #888; font-size: 12px; text-transform: uppercase;">Estimated Shipping</span></td>
                        </tr>
                        <tr>
                            <td style="font-weight: 600; font-size: 16px; padding-top: 4px;">#${orderId}</td>
                            <td style="text-align: right; font-weight: 600; font-size: 16px; padding-top: 4px;">3-5 Business Days</td>
                        </tr>
                    </table>
                </div>

                <div style="border-top: 1px solid #eee; padding-top: 30px;">
                    <h3 style="font-size: 16px; margin: 0 0 20px 0;">Order Summary</h3>
                    <table style="width: 100%; border-collapse: collapse;">
                        <tr>
                            <td style="padding-bottom: 20px;">
                                <div style="font-weight: 600; color: #111;">Professional AISI 304 Stainless Steel Sheet</div>
                                <div style="font-size: 14px; color: #666; margin-top: 4px;">1 Side Brushed / 1 Side Polished Mirror</div>
                                <div style="display: inline-block; background: #eefdf3; color: #166534; font-size: 11px; font-weight: 600; padding: 2px 8px; border-radius: 4px; margin-top: 8px;">Premium Laser Film Included</div>
                            </td>
                            <td style="text-align: right; vertical-align: top; font-weight: 600;">€${amountTotal.toFixed(2)}</td>
                        </tr>
                    </table>
                </div>

                <div style="border-top: 1px solid #eee; padding-top: 20px; margin-top: 10px;">
                    <table style="width: 100%;">
                        <tr>
                            <td style="color: #666; font-size: 14px;">Total Paid</td>
                            <td style="text-align: right; font-size: 20px; font-weight: 600; color: #000;">€${amountTotal.toFixed(2)}</td>
                        </tr>
                    </table>
                </div>

                <div style="margin-top: 40px; padding: 30px; border: 1px solid #eee; border-radius: 12px;">
                    <h3 style="font-size: 14px; margin-top: 0; text-transform: uppercase; color: #888;">Next Steps</h3>
                    <p style="font-size: 14px; line-height: 1.5; color: #444; margin-bottom: 0;">Our craft team is now preparing your sheet. You will receive another update with a tracking number as soon as the courier picks up your package.</p>
                </div>
                
                <p style="margin-top: 40px; font-size: 14px; color: #888; text-align: center;">If you have any questions, simply reply to this email.</p>
            </div>
            
            <div style="background-color: #f7f7f7; padding: 30px; text-align: center;">
                <p style="margin: 0; font-size: 12px; color: #999;">&copy; 2026 ProTech Solutions. All rights reserved.</p>
                <div style="margin-top: 15px;">
                    <a href="https://protech-solutions.onrender.com" style="color: #666; font-size: 12px; text-decoration: none; margin: 0 10px;">Website</a>
                    <a href="#" style="color: #666; font-size: 12px; text-decoration: none; margin: 0 10px;">Terms</a>
                    <a href="#" style="color: #666; font-size: 12px; text-decoration: none; margin: 0 10px;">Privacy</a>
                </div>
            </div>
        </div>
        `
    };

    try {
        await transporter.sendMail(mailOptions);
        console.log(`Confirmation email sent to customer: ${customerEmail}`);
    } catch (error) {
        console.error('Error sending customer email:', error);
    }
}


// Fallback for local development when webhooks can't reach localhost
app.get('/verify-session/:id', async (req, res) => {
    try {
        const session = await stripe.checkout.sessions.retrieve(req.params.id);

        if (session.payment_status === 'paid') {
            console.log(`Manual verification success for session ID: ${session.id}`);
            await sendOrderEmail(session);
            await sendCustomerEmail(session);
            res.json({ success: true, message: 'Emails sent' });
        } else {
            res.json({ success: false, message: 'Payment not completed' });
        }
    } catch (error) {
        console.error("Verification Error:", error);
        res.status(500).json({ error: error.message });
    }
});

const PORT = process.env.PORT || 4242;
app.listen(PORT, () => console.log(`Running on port ${PORT}`));
