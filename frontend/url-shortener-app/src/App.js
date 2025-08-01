import React from "react";
import { BrowserRouter as Router, Routes, Route, Link } from "react-router-dom";
import ShortenerPage from "./pages/ShortenerPage";
import RedirectPage from "./pages/RedirectPage";

import StatisticsPage from "./pages/StatisticsPage";
import {
AppBar,
Toolbar,
Typography,
Button,
Container,
} from "@mui/material";

function App() {
return (
<Router>
<AppBar position="static">
<Toolbar>
<Typography variant="h6" sx={{ flexGrow: 1 }}>
URL Shortener
</Typography>
<Button color="inherit" component={Link} to="/">
Shortener
</Button>
<Button color="inherit" component={Link} to="/stats">
Statistics
</Button>
</Toolbar>
</AppBar>


  <Container sx={{ mt: 4 }}>
    <Routes>
      <Route path="/" element={<ShortenerPage />} />
      <Route path="/stats" element={<StatisticsPage />} />
      <Route path="/:shortcode" element={<RedirectPage />} />
    </Routes>
  </Container>
</Router>
);
}

export default App;