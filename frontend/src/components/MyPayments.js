import React, { useEffect, useState } from 'react';
import Cookies from 'js-cookie'; // For getting customerId from cookies
import { useNavigate, useLocation } from 'react-router-dom'; // Use useLocation to detect the route

const MyPayments = () => {
    const [orders, setOrders] = useState([]);
    const customerId = Cookies.get('customerId'); // Fetch the customerId from cookies
    const navigate = useNavigate();
    const location = useLocation();

    const isManagerView = location.pathname === '/regular-orders'; // Check if manager is viewing all orders

    useEffect(() => {
        if (isManagerView) {
            // Fetch all customer orders if it's the manager view
            fetchAllOrders();
        } else {
            // Retrieve saved orders for the specific customerId from localStorage if it's customer view
            const savedOrders = JSON.parse(localStorage.getItem(`orders_${customerId}`)) || [];
            const filteredOrders = savedOrders.filter(order => order.customerId === customerId);
            setOrders(filteredOrders);
        }
    }, [customerId, isManagerView]);

    const fetchAllOrders = async () => {
        try {
            const response = await fetch('http://localhost:8070/api/orders'); // Fetch all orders for the manager view
            const data = await response.json();
            console.log('Fetched all customer orders:', data); // Debugging log for data structure

            // Check if the data is an array, if not, make it an array
            if (Array.isArray(data)) {
                setOrders(data); // If data is already an array, set it directly
            } else if (data.orders && Array.isArray(data.orders)) {
                setOrders(data.orders); // If data is an object containing an orders array, extract the array
            } else {
                setOrders([]); // If data is not in a recognizable format, set an empty array to avoid errors
            }
        } catch (error) {
            console.error('Error fetching all customer orders:', error);
            setOrders([]); // Ensure orders is an empty array in case of an error
        }
    };

    const handleReturnRequest = (orderId) => {
        // Navigate to the return request page with the orderId
        navigate(`/return-request/${orderId}`, { state: { orderId } });
    };

    return (
        <div>
            <h1>{isManagerView ? 'All Customer Payments' : 'My Payments'}</h1>
            {orders.length === 0 ? (
                <p>No payments found.</p>
            ) : (
                <div>
                    {orders.map((order, index) => (
                        <div key={index} className="payment-summary">
                            <h2>Order ID: {order.orderId}</h2>
                            <p><strong>Payment Date:</strong> {order.paymentDate}</p>
                            <p><strong>Total Amount Paid:</strong> Rs. {order.cartTotal?.toLocaleString()}</p>

                            <h3>Items:</h3>
                            <ul>
                                {order.cart.map((item, idx) => (
                                    <li key={idx}>
                                        {item.productId.P_name} - {item.quantity} x Rs. {item.productId.Price.toLocaleString()}
                                    </li>
                                ))}
                            </ul>

                            {/* Return Button */}
                            {!isManagerView && ( // Show the return button only for customer view
                                <button onClick={() => handleReturnRequest(order.orderId)}>
                                    Request Return
                                </button>
                            )}

                            <hr />
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
};

export default MyPayments;
