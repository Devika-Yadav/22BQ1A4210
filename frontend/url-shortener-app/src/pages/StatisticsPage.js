import React, { useState } from "react";
import {
  Container,
  Typography,
  Grid,
  TextField,
  Button,
  Card,
  CardContent,
  Alert,
  Box,
} from "@mui/material";
import { log } from "../middleware/logger";

const ShortenerPage = () => {
  const [inputs, setInputs] = useState([
    { url: "", validity: "", shortcode: "" },
  ]);
  const [errors, setErrors] = useState([]);
  const [results, setResults] = useState([]);

  const handleChange = (index, field, value) => {
    const newInputs = [...inputs];
    newInputs[index][field] = value;
    setInputs(newInputs);
  };

  const addInputField = () => {
    if (inputs.length < 5) {
      setInputs([...inputs, { url: "", validity: "", shortcode: "" }]);
    }
  };

  const validateInput = (input) => {
    const urlRegex = /^(https?:\/\/)[\w.-]+\.[\w]{2,}(\/\S*)?$/;
    if (!urlRegex.test(input.url)) return "Invalid URL format";
    if (
      input.validity &&
      (!Number.isInteger(Number(input.validity)) || Number(input.validity) <= 0)
    ) {
      return "Validity must be a positive integer";
    }
    if (input.shortcode && !/^[a-zA-Z0-9]{3,15}$/.test(input.shortcode)) {
      return "Shortcode must be alphanumeric (3-15 chars)";
    }
    return null;
  };

  const handleSubmit = async () => {
    const newErrors = [];
    const validInputs = [];

    inputs.forEach((input, idx) => {
      const err = validateInput(input);
      if (err) {
        newErrors[idx] = err;
        log("error", "validation", `Input ${idx + 1}: ${err}`);
      } else {
        newErrors[idx] = null;
        validInputs.push({
          ...input,
          validity: input.validity ? parseInt(input.validity) : 30,
        });
      }
    });

    setErrors(newErrors);

    if (validInputs.length === 0) return;

    try {
      const now = new Date();
      const mockResponse = validInputs.map((item, i) => {
        const shortcode = item.shortcode || "autogen" + Math.random().toString(36).slice(2, 8);
        const createdAt = now.toISOString();
        const expiresAt = new Date(now.getTime() + item.validity * 60000).toISOString();

        return {
          originalUrl: item.url,
          shortcode,
          createdAt,
          expiresAt,
        };
      });

      // Store to localStorage for statistics page
      const existing = JSON.parse(localStorage.getItem("shortenedUrls") || "[]");
      const updated = [...existing, ...mockResponse];
      localStorage.setItem("shortenedUrls", JSON.stringify(updated));

      log("info", "submit", `Generated ${mockResponse.length} short links`);
      setResults(mockResponse);
    } catch (err) {
      log("error", "submit", `Failed to generate links: ${err.message}`);
    }
  };

  return (
    <Container maxWidth="md" sx={{ mt: 4 }}>
      <Typography variant="h4" gutterBottom>
        URL Shortener
      </Typography>

      {inputs.map((input, index) => (
        <Card key={index} sx={{ mb: 2 }}>
          <CardContent>
            <Grid container spacing={2}>
              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  label="Long URL"
                  value={input.url}
                  onChange={(e) => handleChange(index, "url", e.target.value)}
                  error={!!errors[index]}
                  helperText={errors[index]}
                />
              </Grid>
              <Grid item xs={12} sm={3}>
                <TextField
                  fullWidth
                  label="Validity (min)"
                  type="number"
                  value={input.validity}
                  onChange={(e) => handleChange(index, "validity", e.target.value)}
                />
              </Grid>
              <Grid item xs={12} sm={3}>
                <TextField
                  fullWidth
                  label="Custom Shortcode"
                  value={input.shortcode}
                  onChange={(e) => handleChange(index, "shortcode", e.target.value)}
                />
              </Grid>
            </Grid>
          </CardContent>
        </Card>
      ))}

      <Box sx={{ display: "flex", gap: 2, mb: 3 }}>
        <Button variant="contained" color="primary" onClick={handleSubmit}>
          Shorten URLs
        </Button>
        <Button
          variant="outlined"
          disabled={inputs.length >= 5}
          onClick={addInputField}
        >
          + Add Another
        </Button>
      </Box>

      {results.length > 0 && (
        <Box>
          <Typography variant="h5">Shortened URLs</Typography>
          {results.map((res, idx) => (
            <Alert key={idx} severity="success" sx={{ mt: 2 }}>
              <strong>{res.originalUrl}</strong> → http://localhost:3000/{res.shortcode} (expires at {new Date(res.expiresAt).toLocaleString()})
            </Alert>
          ))}
        </Box>
      )}
    </Container>
  );
};

export default ShortenerPage;
