require('dotenv').config();
const express = require('express');
const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);
const cors = require('cors');

const app = express();
app.use(cors());
app.use(express.static('.')); // Serve static files (html, css, js)
app.use(express.json());

const DOMAIN = 'http://localhost:4242';

app.post('/create-checkout-session', async (req, res) => {
    try {
        const cartItems = req.body.cart;

        if (!cartItems || cartItems.length === 0) {
            return res.status(400).json({ error: 'Cart is empty' });
        }

        const lineItems = cartItems.map(item => ({
            price_data: {
                currency: 'usd',
                product_data: {
                    name: item.title,
                    images: [item.image], // Stripe expects a valid URL
                    description: item.desc || item.material
                },
                unit_amount: Math.round(item.price * 100), // Stripe expects cents
            },
            quantity: item.qty,
        }));

        // Shipping Options
        const shippingOptions = [
            {
                shipping_rate_data: {
                    type: 'fixed_amount',
                    fixed_amount: { amount: 0, currency: 'usd' },
                    display_name: 'Store Pickup',
                    delivery_estimate: {
                        minimum: { unit: 'business_day', value: 1 },
                        maximum: { unit: 'business_day', value: 2 },
                    },
                },
            },
            {
                shipping_rate_data: {
                    type: 'fixed_amount',
                    fixed_amount: { amount: 2500, currency: 'usd' }, // $25.00
                    display_name: 'Standard Delivery',
                    delivery_estimate: {
                        minimum: { unit: 'business_day', value: 3 },
                        maximum: { unit: 'business_day', value: 5 },
                    },
                },
            },
        ];

        const session = await stripe.checkout.sessions.create({
            payment_method_types: ['card'],
            line_items: lineItems,
            mode: 'payment',
            shipping_address_collection: {
                allowed_countries: ['ES', 'US', 'CA', 'GB', 'DE', 'FR', 'NL', 'BE'], // Added ES and common EU countries
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
    }
    response.json({ received: true });
});

// Helper function to send professional HTML email
async function sendOrderEmail(session) {
    const amountTotal = session.amount_total / 100;
    const shippingCost = session.total_details?.amount_shipping / 100 || 0;
    const orderId = session.id.slice(-8).toUpperCase();

    const mailOptions = {
        from: `"Protecht Solutions Orders" <${process.env.EMAIL_USER}>`,
        to: 'benjazpz@gmail.com',
        subject: `Order Confirmation #${orderId} - Protecht Solutions`,
        html: `
        <div style="font-family: 'Helvetica Neue', Helvetica, Arial, sans-serif; max-width: 600px; margin: 0 auto; border: 1px solid #eee; border-radius: 10px; overflow: hidden; color: #333;">
            <div style="background-color: #111827; padding: 30px; text-align: center;">
                <h1 style="color: #ffffff; margin: 0; font-size: 24px; letter-spacing: 1px;">PROTECHT SOLUTIONS</h1>
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
                            <p style="margin: 0; font-weight: 600; font-size: 16px;">Stainless Steel Kitchen Backsplash</p>
                            <p style="margin: 5px 0 0 0; color: #6b7280; font-size: 14px;">AISI 304 - 3000 x 1500 mm</p>
                        </td>
                        <td style="text-align: right; vertical-align: top;">
                            <span style="font-weight: 600;">$${amountTotal.toFixed(2)}</span>
                        </td>
                    </tr>
                </table>

                <div style="border-top: 1px solid #eee; padding-top: 20px;">
                    <table style="width: 100%;">
                        <tr>
                            <td style="color: #666;">Standard Delivery</td>
                            <td style="text-align: right; font-weight: 600;">$${shippingCost.toFixed(2)}</td>
                        </tr>
                        <tr>
                            <td style="padding-top: 10px; font-size: 18px; font-weight: bold; color: #111827;">Total Amount</td>
                            <td style="padding-top: 10px; text-align: right; font-size: 18px; font-weight: bold; color: #4f46e5;">$${amountTotal.toFixed(2)}</td>
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
                <p style="margin: 0;">&copy; 2026 Protecht Solutions. All rights reserved.</p>
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


// Fallback for local development when webhooks can't reach localhost
app.get('/verify-session/:id', async (req, res) => {
    try {
        const session = await stripe.checkout.sessions.retrieve(req.params.id);

        if (session.payment_status === 'paid') {
            console.log(`Manual verification success for session ID: ${session.id}`);
            await sendOrderEmail(session);
            res.json({ success: true, message: 'Email sent' });
        } else {
            res.json({ success: false, message: 'Payment not completed' });
        }
    } catch (error) {
        console.error("Verification Error:", error);
        res.status(500).json({ error: error.message });
    }
});

app.listen(4242, () => console.log('Running on port 4242'));
