// server/controllers/paymentController.js
const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);
const User = require('../models/user'); 
const Enrollment = require('../models/enrollment'); 
const Course = require('../models/course');         

// 1. Create Checkout Session for a SPECIFIC COURSE
exports.createCheckoutSession = async (req, res) => {
  try {
    const { courseId, courseTitle, price, userId } = req.body;

    const session = await stripe.checkout.sessions.create({
      payment_method_types: ['card'],
      line_items: [
        {
          price_data: {
            currency: 'usd',
            product_data: {
              name: courseTitle, 
              description: `Lifetime access to ${courseTitle}`,
            },
            unit_amount: Math.round(price * 100), // Stripe expects cents
          },
          quantity: 1,
        },
      ],
      mode: 'payment',
      // Redirect to dashboard on success, back to course on cancel
      success_url: `http://localhost:5173/dashboard?enrollment=success`,
      cancel_url: `http://localhost:5173/course/${courseId}?enrollment=cancelled`,
      client_reference_id: userId,
      // Pass courseId in metadata so the webhook knows WHICH course to give them
      metadata: { userId: userId, courseId: courseId } 
    });

    res.json({ url: session.url });
  } catch (error) {
    console.error("Stripe Session Error:", error);
    res.status(500).json({ error: error.message });
  }
};

// 2. Stripe Webhook (Automatically enrolls user after payment)
exports.stripeWebhook = async (req, res) => {
  const sig = req.headers['stripe-signature'];
  let event;

  try {
    event = stripe.webhooks.constructEvent(req.body, sig, process.env.STRIPE_WEBHOOK_SECRET);
  } catch (err) {
    console.error(`Webhook Error: ${err.message}`);
    return res.status(400).send(`Webhook Error: ${err.message}`);
  }

  // Handle successful payments
  if (event.type === 'checkout.session.completed') {
    const session = event.data.object;
    
    const userId = session.metadata.userId;
    const courseId = session.metadata.courseId;

    try {
      // Step A: Check if they are already enrolled to prevent duplicate crashes
      const existingEnrollment = await Enrollment.findOne({ user: userId, course: courseId });
      
      if (!existingEnrollment) {
        // Step B: Create the official Enrollment record! (This is what the Dashboard looks for)
        const newEnrollment = new Enrollment({ user: userId, course: courseId });
        await newEnrollment.save();
        
        // Step C: Increment the course's student count so the number goes up on the frontend!
        await Course.findByIdAndUpdate(courseId, { $inc: { studentCount: 1 } });
        
        console.log(`✅ Success! Created Enrollment for user ${userId} in course ${courseId}`);
      } else {
        console.log(`User ${userId} was already enrolled in course ${courseId}.`);
      }

    } catch (dbErr) {
      console.error("Database error updating enrollment:", dbErr);
    }
  }

  res.json({ received: true });
};