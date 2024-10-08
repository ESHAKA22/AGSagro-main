import React, { useState, useEffect } from 'react';
import axios from 'axios';
import RequestList from '../components/RequestList';

const OrdersPage = () => {
    const [showCustomOrders, setShowCustomOrders] = useState(false);
    const [showRegularOrders, setShowRegularOrders] = useState(false);
    const [requests, setRequests] = useState([]);
    const [regularOrders, setRegularOrders] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    // Function to fetch custom requests from the backend
    const fetchCustomRequests = async () => {
        setLoading(true); // Show loading spinner
        setError(null);   // Reset error state
        try {
            const response = await axios.get('http://localhost:8070/api/requests'); // Endpoint for custom requests
            console.log('Fetched Custom Orders:', response.data); // Log data to verify
            setRequests(response.data); // Set the fetched custom requests
        } catch (error) {
            console.error('Error fetching requests:', error);
            setError('Failed to fetch custom requests.'); // Set error message
        } finally {
            setLoading(false); // Stop loading spinner
        }
    };

    // Function to fetch regular orders from the backend
    const fetchRegularOrders = async () => {
        setLoading(true); // Show loading spinner
        setError(null);   // Reset error state
        try {
            const response = await axios.get('http://localhost:8070/api/orders'); // Endpoint for regular orders
            console.log('Fetched Regular Orders:', response.data); // Log data to verify
            setRegularOrders(response.data); // Set the fetched regular orders
        } catch (error) {
            console.error('Error fetching regular orders:', error);
            setError('Failed to fetch regular orders.'); // Set error message
        } finally {
            setLoading(false); // Stop loading spinner
        }
    };

    // Handle showing custom orders
    const handleShowCustomOrders = () => {
        setShowCustomOrders(true);
        setShowRegularOrders(false);
        fetchCustomRequests(); // Fetch custom requests when showing custom orders
    };

    // Handle showing regular orders
    const handleShowRegularOrders = () => {
        setShowCustomOrders(false);
        setShowRegularOrders(true);
        fetchRegularOrders(); // Fetch regular orders when showing regular orders
    };

    // Handle deletion of a request
    const handleDelete = async (id) => {
        try {
            await axios.delete(`http://localhost:8070/requests/${id}`);
            fetchCustomRequests(); // Refresh the request list after deletion
        } catch (error) {
            console.error('Error deleting request:', error);
        }
    };

    // Handle editing of a request
    const handleEdit = (request) => {
        console.log('Edit request:', request);
    };

    return (
        <div>
            <h1>Orders Page</h1>
            <div style={{ marginBottom: '20px' }}>
                <button 
                    onClick={handleShowCustomOrders} 
                    style={{
                        padding: '10px 20px',
                        marginRight: '20px', 
                        fontSize: '1em',
                        cursor: 'pointer',
                        borderRadius: '5px',
                        backgroundColor: '#4CAF50',
                        color: 'white',
                        border: 'none',
                    }}
                >
                    Custom Orders
                </button>
                <button 
                    onClick={handleShowRegularOrders} 
                    style={{
                        padding: '10px 20px',
                        fontSize: '1em',
                        cursor: 'pointer',
                        borderRadius: '5px',
                        backgroundColor: '#4CAF50',
                        color: 'white',
                        border: 'none',
                    }}
                >
                    Regular Orders
                </button>
            </div>

            {showCustomOrders && (
                <div>
                    <h2>Custom Orders List</h2>
                    {loading && <p>Loading custom orders...</p>}
                    {error && <p style={{ color: 'red' }}>{error}</p>}
                    {!loading && !error && (
                        <RequestList 
                            requests={requests} 
                            fetchRequests={fetchCustomRequests} 
                            onDelete={handleDelete} 
                            onEdit={handleEdit} 
                        />
                    )}
                </div>
            )}

            {showRegularOrders && (
                <div>
                    <h2>Regular Orders List</h2>
                    {loading && <p>Loading regular orders...</p>}
                    {error && <p style={{ color: 'red' }}>{error}</p>}
                    {!loading && !error && (
                        <div>
                            {regularOrders.length > 0 ? (
                                regularOrders.map((order, index) => (
                                    <div key={index} className="payment-summary">
                                        <h3>Order ID: {order._id}</h3>
                                        <p><strong>Order Date:</strong> {new Date(order.createdAt).toLocaleDateString()}</p>
                                        <h4>Items:</h4>
                                        <ul>
                                            {order.cart && order.cart.map((item, idx) => (
                                                <li key={idx}>
                                                    Product ID: {item.productId} - Quantity: {item.quantity}
                                                </li>
                                            ))}
                                        </ul>
                                        <hr />
                                    </div>
                                ))
                            ) : (
                                <p>No regular orders found.</p>
                            )}
                        </div>
                    )}
                </div>
            )}
        </div>
    );
};

export default OrdersPage;
