export const log = async (level, pkg, message) => {
  const payload = {
    timestamp: new Date().toISOString(),
    level,
    package: pkg,
    message,
  };

  console.log("Client log:", payload); // For local dev visibility

  try {
    await fetch("https://your-logging-api-endpoint.com/log", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(payload),
    });
  } catch (err) {
    console.error("Failed to send log", err);
  }
};
