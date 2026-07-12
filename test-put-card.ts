async function testPutCard() {
  console.log("Testing PUT /cards/card1...");
  try {
    const response = await fetch("http://localhost:3000/api/insurance/cards/card1", {
      method: "PUT",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        status: "APPROVED"
      })
    });
    console.log("Status:", response.status);
    const data = await response.json();
    console.log("Data:", data);
  } catch (error) {
    console.error("Error:", error);
  }
}

testPutCard();
