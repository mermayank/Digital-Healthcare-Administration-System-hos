async function testPostCard() {
  console.log("Testing POST /cards...");
  try {
    const requestBody = require('./specs/examples/cards/POST/request.json');
    console.log("Request body:", requestBody);
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

testPostCard();
