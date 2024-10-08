import React, { useEffect, useState } from 'react';
import axios from 'axios';
import './AllCustomerOrders.css';

const AllCustomerOrders = () => {
    const [orders, setOrders] = useState([]);

    useEffect(() => {
        fetchAllOrders();
    }, []);

    const fetchAllOrders = async () => {
        try {
            const response = await axios.get('http://localhost:8070/api/orders'); // Fetch all orders from the server
            const data = response.data;
            console.log('Fetched all customer orders:', data); // Debugging log for data structure

            // Ensure that the data is in an array format
            if (Array.isArray(data)) {
                setOrders(data);
            } else if (data.orders && Array.isArray(data.orders)) {
                setOrders(data.orders);
            } else {
                setOrders([]);
            }
        } catch (error) {
            console.error('Error fetching all customer orders:', error);
            setOrders([]);
        }
    };

    return (
        <div>
            <h1>All Customer Payments</h1>
            {orders.length === 0 ? (
                <p>No payments found.</p>
            ) : (
                <div>
                    {orders.map((order, index) => (
                        <div key={index} className="payment-summary">
                            <h2>Order ID: {order.orderId || 'N/A'}</h2>
                            <p><strong>Customer ID:</strong> {order.customerId || 'N/A'}</p>
                            <p><strong>Payment Date:</strong> {order.paymentDate ? new Date(order.paymentDate).toLocaleDateString() : 'N/A'}</p>
                            <p><strong>Total Amount Paid:</strong> Rs. {order.cartTotal ? order.cartTotal.toLocaleString() : 'N/A'}</p>

                            <h3>Customer Details</h3>
                            <p><strong>Name:</strong> {order.shippingDetails?.firstName} {order.shippingDetails?.lastName}</p>
                            <p><strong>Email:</strong> {order.shippingDetails?.email}</p>
                            <p><strong>Phone:</strong> {order.shippingDetails?.phone}</p>
                            <p><strong>Address:</strong> {order.shippingDetails?.address}, {order.shippingDetails?.city}, {order.shippingDetails?.zipCode}</p>

                            <h3>Items</h3>
                            <ul>
                                {order.cart && order.cart.length > 0 ? (
                                    order.cart.map((item, idx) => (
                                        <li key={idx}>
                                            {item.productId?.P_name || 'Unknown Product'} - {item.quantity} x Rs. {item.productId?.Price?.toLocaleString() || 'N/A'}
                                            <br />
                                            <strong>Total:</strong> Rs. {(item.productId?.Price * item.quantity).toLocaleString() || 'N/A'}
                                        </li>
                                    ))
                                ) : (
                                    <li>No items found.</li>
                                )}
                            </ul>

                            <hr />
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
};

export default AllCustomerOrders;
