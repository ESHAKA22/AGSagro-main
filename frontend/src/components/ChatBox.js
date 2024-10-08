import React, { useState } from 'react';
import './ChatBox.css'; // Keep this unless you rename the CSS file

const ChatBox = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState('');

  const toggleChatbox = () => {
    setIsOpen(!isOpen);
  };

  const handleInputChange = (e) => {
    setInput(e.target.value);
  };

  const handleSend = () => {
    if (input.trim()) {
      const userMessage = { sender: 'user', text: input };
      const replyMessage = generateReply(input);

      setMessages([...messages, userMessage, replyMessage]);
      setInput('');
    }
  };

  const generateReply = (question) => {
    let replyText = 'Sorry, I did not understand that. Please ask about our products or services.';

    const lowerCaseQuestion = question.toLowerCase();

    if (lowerCaseQuestion.includes('hi') || lowerCaseQuestion.includes('hey') || lowerCaseQuestion.includes('hello')) {
        replyText = 'Hello! How can I assist you with our tractor spare parts or custom solutions?';
    } else if (lowerCaseQuestion.includes('thank you') || lowerCaseQuestion.includes('thanks')) {
        replyText = 'You’re welcome! If you have more questions, feel free to ask.';
    } else if (lowerCaseQuestion.includes('ok')) {
        replyText = 'Alright. Let us know if there’s anything else you need.';
    } else if (lowerCaseQuestion.includes('bye')) {
        replyText = 'Goodbye! Feel free to reach out anytime.';
    } else if (lowerCaseQuestion.includes('products')) {
        replyText = 'We offer a range of tractor spare parts and can create custom parts to meet your needs. Please visit our Products page for details.';
    } else if (lowerCaseQuestion.includes('order') || lowerCaseQuestion.includes('purchase')) {
        replyText = 'To place an order, you can use our website’s order form or contact our sales team directly.';
    } else if (lowerCaseQuestion.includes('contact')) {
        replyText = 'You can contact us at 0714937441 or email us at support@AGSagro.com.';
    } else if (lowerCaseQuestion.includes('hours')) {
        replyText = 'Our office hours are from 9 AM to 6 PM, Monday to Friday.';
    } else if (lowerCaseQuestion.includes('location')) {
        replyText = 'We are located at 519/12/Udumulla Road,Battaramulla.';
    } else if (lowerCaseQuestion.includes('custom parts')) {
        replyText = 'We specialize in creating custom tractor parts. Please provide your specifications, and we’ll get back to you with a quote.';
    } else if (lowerCaseQuestion.includes('shipping')) {
        replyText = 'We offer worldwide shipping. Shipping costs and times vary based on your location. Please visit our Shipping page for more details.';
    } else if (lowerCaseQuestion.includes('cost')) {
        replyText = 'The cost of parts depends on the type and quantity. Please visit our Pricing page or contact us for a detailed quote.';
    }

    return { sender: 'bot', text: replyText };
  };

  return (
    <div className={`chatbox-container ${isOpen ? 'open' : ''}`}>
      <button className="chatbox-toggle" onClick={toggleChatbox}>
        {isOpen ? 'Close Chat' : 'Chat with Us'}
      </button>
      {isOpen && (
        <div className="chatbox">
          <div className="chatbox-messages">
            {messages.map((msg, index) => (
              <div key={index} className={`chatbox-message ${msg.sender}`}>
                {msg.text}
              </div>
            ))}
          </div>
          <div className="chatbox-input">
            <input 
              type="text" 
              value={input} 
              onChange={handleInputChange} 
              placeholder="Type your question..."
            />
            <button onClick={handleSend}>Send</button>
          </div>
        </div>
      )}
    </div>
  );
};

export default ChatBox;
