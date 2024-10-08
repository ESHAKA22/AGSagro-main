import React, { useState, useEffect } from "react";
import axios from "axios";
import { jsPDF } from "jspdf"; // Import jsPDF library
import "jspdf-autotable"; // Import jsPDF AutoTable plugin

export default function AddTicket() {
  const [fname, setFName] = useState("");
  const [lname, setLName] = useState("");
  const [email, setEmail] = useState("");
  const [number, setNumber] = useState("");
  const [option, setOption] = useState("");
  const [radios, setRadios] = useState("");
  const [comment, setComment] = useState("");
  const [attach, setAttach] = useState(null);
  const [rangeValue, setRangeValue] = useState(0);
  const [submitted, setSubmitted] = useState(false);
  const [errors, setErrors] = useState({});
  const [date, setDate] = useState(""); // New state for date input

  const formFields = [fname, lname, email, number, option, radios, comment, date];
  const totalFields = formFields.length;
  const filledFields = formFields.filter((field) => field !== "").length;
  const progress = (filledFields / totalFields) * 100;

  useEffect(() => {
    setRangeValue(progress);
  }, [progress]);

  const validate = () => {
    let errors = {};

    if (!fname.trim()) errors.fname = "First name is required";
    if (!lname.trim()) errors.lname = "Last name is required";
    if (!email.trim()) errors.email = "Email is required";
    if (!/\S+@\S+\.\S+/.test(email)) errors.email = "Email address is invalid";
    if (!number.trim()) {
      errors.number = "Phone number is required";
    } else if (!/^\d{10}$/.test(number)) {
      errors.number = "Phone number must be exactly 10 digits.";
    }
    if (!date.trim()) errors.date = "Date is required"; // Validate date

    return errors;
  };

  const generatePDF = () => {
    const doc = new jsPDF();

    // Set up PDF Title and Headers
    doc.setFontSize(18);
    doc.text("Ticket Report", 14, 22);
    doc.setFontSize(12);
    doc.text(`Generated on: ${new Date().toLocaleDateString()}`, 14, 30);

    // Create Table Structure
    const tableColumn = ["Field", "Value"];
    const tableRows = [
      ["First Name", fname],
      ["Last Name", lname],
      ["Email", email],
      ["Phone Number", number],
      ["Problem Type", option],
      ["Priority Level", radios],
      ["Comments", comment],
      ["Date", date], // Add date to the PDF
    ];

    // Adding table using AutoTable plugin
    doc.autoTable({
      head: [tableColumn],
      body: tableRows,
      startY: 40, // Start the table below the title
      theme: "grid",
      styles: { fontSize: 10 },
      headStyles: { fillColor: [22, 160, 133] },
      margin: { top: 10 },
    });

    doc.save("ticket_report.pdf");
  };

  function sendData(e) {
    e.preventDefault();

    const formData = new FormData();
    formData.append("first_name", fname);
    formData.append("last_name", lname);
    formData.append("email", email);
    formData.append("phone_number", number);
    formData.append("priority_level", radios);
    formData.append("problem", option);
    formData.append("comments", comment);
    formData.append("date", date); // Add date to form data
    if (attach) {
      formData.append("attachment", attach);
    }

    const validationErrors = validate();
    if (Object.keys(validationErrors).length === 0) {
      axios
        .post("http://localhost:8070/customer/add", formData, {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        })
        .then(() => {
          alert("Ticket added successfully");
          generatePDF(); // Generate the PDF for the new ticket

          // Clear form fields
          setFName("");
          setLName("");
          setEmail("");
          setNumber("");
          setOption("");
          setRadios("");
          setComment("");
          setAttach(null);
          setDate(""); // Clear date field

          // Set form as submitted
          setSubmitted(true);

          // Wait for 2 seconds, then refresh the page
          setTimeout(() => {
            window.location.reload();
          }, 2000);
        })
        .catch((error) => console.error("Error submitting form:", error));
    } else {
      setErrors(validationErrors);
    }
  }

  return (
    <div className="max-w-3xl mx-auto p-10 bg-gradient-to-br from-white to-blue-50 shadow-lg rounded-lg mt-10">
      <form onSubmit={sendData} className="space-y-8">
        <h2 className="text-center text-3xl font-semibold text-blue-700 mb-8">Submit a Ticket</h2>
  
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
          <div>
            <label htmlFor="fname" className="block text-gray-800 font-medium mb-2">First Name *</label>
            <input
              type="text"
              className={`w-full p-3 rounded-md border ${errors.fname ? "border-red-500" : "border-blue-300"} focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-900`}
              id="fname"
              placeholder="Enter first name"
              onChange={(e) => setFName(e.target.value)}
              value={fname}
            />
            {errors.fname && <div className="text-red-500 text-sm mt-1">{errors.fname}</div>}
          </div>
  
          <div>
            <label htmlFor="lname" className="block text-gray-800 font-medium mb-2">Last Name *</label>
            <input
              type="text"
              className={`w-full p-3 rounded-md border ${errors.lname ? "border-red-500" : "border-blue-300"} focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-900`}
              id="lname"
              placeholder="Enter last name"
              onChange={(e) => setLName(e.target.value)}
              value={lname}
            />
            {errors.lname && <div className="text-red-500 text-sm mt-1">{errors.lname}</div>}
          </div>
  
          <div>
            <label htmlFor="email" className="block text-gray-800 font-medium mb-2">Email *</label>
            <input
              type="email"
              className={`w-full p-3 rounded-md border ${errors.email ? "border-red-500" : "border-blue-300"} focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-900`}
              id="email"
              placeholder="Enter email address"
              onChange={(e) => setEmail(e.target.value)}
              value={email}
            />
            {errors.email && <div className="text-red-500 text-sm mt-1">{errors.email}</div>}
          </div>
  
          <div>
            <label htmlFor="number" className="block text-gray-800 font-medium mb-2">Phone Number *</label>
            <input
              type="text"
              className={`w-full p-3 rounded-md border ${errors.number ? "border-red-500" : "border-blue-300"} focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-900`}
              id="number"
              placeholder="Enter phone number"
              onChange={(e) => {
                const value = e.target.value;
                if (/^\d{0,10}$/.test(value)) {
                  setNumber(value);
                }
              }}
              value={number}
            />
            {errors.number && <div className="text-red-500 text-sm mt-1">{errors.number}</div>}
          </div>
        </div>
  
        <div className="mb-4">
          <label htmlFor="option" className="block text-gray-800 font-medium mb-2">I’m having a problem with *</label>
          <select
            className="w-full p-3 rounded-md border border-blue-300 focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-900"
            id="option"
            required
            onChange={(e) => setOption(e.target.value)}
            value={option}
          >
            <option value="" disabled>Choose...</option>
            <option value="Technical">Technical</option>
            <option value="Billing">Billing</option>
            <option value="Other">Other</option>
          </select>
        </div>
  
        <fieldset className="mb-4">
          <legend className="text-gray-800 font-medium mb-4">Priority Level *</legend>
          <div className="space-y-2">
            {["Today", "In The Next 48 Hours", "This Week", "Future"].map((value, index) => (
              <div key={index} className="flex items-center">
                <input
                  type="radio"
                  id={`gridRadios${index + 1}`}
                  name="gridRadios"
                  value={value}
                  checked={radios === value}
                  onChange={(e) => setRadios(e.target.value)}
                  className="h-4 w-4 text-blue-600 focus:ring-blue-500 mr-3"
                />
                <label htmlFor={`gridRadios${index + 1}`} className="text-gray-800">{value}</label>
              </div>
            ))}
          </div>
        </fieldset>
  
        <div className="mb-4">
          <label htmlFor="comment" className="block text-gray-800 font-medium mb-2">Comments</label>
          <textarea
            className="w-full p-3 rounded-md border border-blue-300 focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-900"
            id="comment"
            rows="4"
            onChange={(e) => setComment(e.target.value)}
            value={comment}
          ></textarea>
        </div>
  
        <div className="mb-4">
          <label htmlFor="date" className="block text-gray-800 font-medium mb-2">Date *</label>
          <input
            type="date"
            className={`w-full p-3 rounded-md border ${errors.date ? "border-red-500" : "border-blue-300"} focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-900`}
            id="date"
            onChange={(e) => setDate(e.target.value)}
            value={date}
          />
          {errors.date && <div className="text-red-500 text-sm mt-1">{errors.date}</div>}
        </div>
  
        <div className="mb-4">
          <label htmlFor="attach" className="block text-gray-800 font-medium mb-2">Attachment</label>
          <input
            type="file"
            className="w-full p-3 rounded-md border border-blue-300 focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-900"
            id="attach"
            onChange={(e) => setAttach(e.target.files[0])}
          />
        </div>
  
        <div className="relative w-full bg-blue-100 rounded-full h-6 mb-6">
          <div className="absolute top-0 left-0 h-6 rounded-full bg-blue-600" style={{ width: `${rangeValue}%` }}>
            <span className="text-white text-sm ml-2">{Math.round(rangeValue)}%</span>
          </div>
        </div>
  
        <button type="submit" className="w-full py-3 rounded-md text-white bg-blue-700 hover:bg-blue-600 font-semibold transition duration-300 shadow-md">
          Submit Ticket
        </button>
      </form>
    </div>
  );
  
  
  
  
}
