async function testServer() {
  console.log("Testing POST /cards...");
  try {
    const requestBody = {
      "providerId": "prov1",
      "cardNumber": "AB9876543210",
      "holderName": "Jane Smith",
      "policyNumber": "POL987654",
      "expiryDate": "2026-06-30",
      "coverageAmount": 750000,
      "documentUrl": "/uploads/card2.jpg"
    };
    const response = await fetch("http://localhost:3000/api/insurance/cards", {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify(requestBody)
    });
    console.log("Status:", response.status);
    const data = await response.json();
    console.log("Data:", data);
  } catch (error) {
    console.error("Error:", error);
  }
}

testServer();
