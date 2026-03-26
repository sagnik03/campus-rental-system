import Booking from '../models/Booking.model.js';
import Item from '../models/Item.model.js';
import Payment from '../models/Payment.model.js';
import User from '../models/User.model.js';

export const getAllUsers = async () => {
    return User.find().select('-password').sort({ createdAt: -1 });
};

export const getAllItems = async () => {
    return Item.find().populate('owner', 'name email role').sort({ createdAt: -1 });
};

export const getAllBookings = async () => {
    return Booking.find()
        .populate('user', 'name email role')
        .populate('item', 'title category pricePerDay')
        .sort({ createdAt: -1 });
};

export const getAllPayments = async () => {
    return Payment.find()
        .populate('payer', 'name email role')
        .populate('booking', 'item user totalPrice status startDate endDate')
        .sort({ createdAt: -1 });
};

export const deleteAnyItemByAdmin = async (itemId) => {
    const item = await Item.findByIdAndDelete(itemId);
    return item;
};
