async function hashPassword256(password) {
  const encoder = new TextEncoder();
  const data = encoder.encode(password);
  const hash = await crypto.subtle.digest("SHA-256", data);
  return Array.from(new Uint8Array(hash))
    .map((b) => b.toString(16).padStart(2, "0"))
    .join("");
}

async function hashPassword1(password) {
  const encoder = new TextEncoder();
  const data = encoder.encode(password);
  const hash = await crypto.subtle.digest("SHA-1", data);
  return Array.from(new Uint8Array(hash))
    .map((b) => b.toString(16).padStart(2, "0"))
    .join("");
}

function updateHashedPasswordDisplay(
  hashedPassword1,
  hashedPassword2,
  clearTextPassword
) {
  document.getElementById("hashedPassword").innerHTML = `
    <div>Hashed Password (SHA-256): ${hashedPassword1}</div>
    <div>Hashed Password (SHA-1): ${hashedPassword2}</div>
    <div>Clear Text Password: ${clearTextPassword}</div>
  `;
}

async function checkPasswordStrength() {
  var password = document.getElementById("passwordInput").value;
  var strengthResult = document.getElementById("strengthResult");
  var strength = 0;
  if (password.length > 0) {
    // Basic checks for length
    strength += password.length * 4;
    // Extra points for mix of letters, numbers, and symbols
    if (/\d/.test(password)) strength += 5;
    if (/[a-z]/.test(password)) strength += 5;
    if (/[A-Z]/.test(password)) strength += 5;
    if (/\W/.test(password)) strength += 5;

    // Hash the password
    const hashedPassword = await hashPassword256(password);
    const hashedPassword2 = await hashPassword1(password);
    updateHashedPasswordDisplay(hashedPassword, hashedPassword2, password);
  } else {
    updateHashedPasswordDisplay("N/A", "N/A");
  }

  // Convert strength into a cracking time estimate
  var timeToCrack = "";
  if (strength < 20) {
    timeToCrack = "instantly";
  } else if (strength < 35) {
    timeToCrack = "in a few seconds";
  } else if (strength < 50) {
    timeToCrack = "in a few minutes";
  } else if (strength < 60) {
    timeToCrack = "in several hours";
  } else if (strength < 70) {
    timeToCrack = "in a few days";
  } else {
    timeToCrack = "in centuries (very strong)";
  }

  strengthResult.innerText =
    "Password strength: " +
    strength +
    ". Estimated time to crack: " +
    timeToCrack;
}
