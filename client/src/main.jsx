// Import StrictMode to help identify potential problems in the app
import { StrictMode } from "react";

// Import createRoot to render the React app
import { createRoot } from "react-dom/client";

// Import the ChatLayout component (make sure it's exported as ChatLayout)
import ChatLayout from "./components/chat/ChatLayout";


// Import global styles
import "./index.css";

import {CssBaseline} from '@mui/material';

// Render the ChatApp inside the root element
createRoot(document.getElementById("root")).render(
  <StrictMode>
    <CssBaseline/>
    <ChatLayout/>
  </StrictMode>
);
