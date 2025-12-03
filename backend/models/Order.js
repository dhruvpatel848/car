const mongoose = require('mongoose');

const orderSchema = new mongoose.Schema({
    customerName: { type: String, required: true },
    customerEmail: { type: String, required: true },
    customerPhone: { type: String, required: true },

    // Car Details
    carDetails: {
        make: { type: String, required: true },
        model: { type: String, required: true },
        year: { type: String, required: true },
        plateNumber: { type: String, required: true }
    },

    // Appointment Details
    appointmentDate: { type: Date, required: true },
    appointmentTime: { type: String, required: true },

    // Address
    address: { type: String, required: true },
    city: { type: String, required: true },

    serviceId: { type: mongoose.Schema.Types.ObjectId, ref: 'Service', required: true },
    serviceName: { type: String }, // Store snapshot in case service changes
    amount: { type: Number, required: true },

    paymentMethod: { type: String, enum: ['Razorpay', 'COD'], required: true },
    paymentStatus: { type: String, enum: ['Pending', 'Paid', 'Failed'], default: 'Pending' },
    razorpayOrderId: { type: String },
    razorpayPaymentId: { type: String },

    status: { type: String, enum: ['Pending', 'Confirmed', 'Completed', 'Cancelled'], default: 'Pending' },
}, { timestamps: true });

module.exports = mongoose.model('Order', orderSchema);
