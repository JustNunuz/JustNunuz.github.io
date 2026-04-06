import { createRoot } from "react-dom/client";
import App from "./App.tsx";
import "./index.css";

const container = document.getElementById("root")!;

// Patch removeChild to prevent browser-extension DOM conflicts
const originalRemoveChild = Node.prototype.removeChild;
Node.prototype.removeChild = function <T extends Node>(child: T): T {
  if (child.parentNode !== this) {
    console.warn("removeChild: node is not a child of this parent — skipping.");
    return child;
  }
  return originalRemoveChild.call(this, child) as T;
};

createRoot(container).render(<App />);
