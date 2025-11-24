require("dotenv").config();
const cors = require("cors");
const express = require("express");
const mongoose = require("mongoose");
const swaggerJsDoc = require("swagger-jsdoc");
const swaggerUi = require("swagger-ui-express");
const cookieParser = require("cookie-parser");

// Routes
const userRoute = require("./routes/user.routes");
const listingRoute = require("./routes/listing.routes");
const reviewRoute = require("./routes/review.routes");
const bookingRoute = require("./routes/booking.routes");
const paymentRoute = require("./routes/payment.routes");
const amenityRoute = require("./routes/amenity.routes");
const wishlistRoute = require("./routes/wishlist.routes");

const app = express();
const port = process.env.PORT || 3000;

// Middleware
app.use(express.json());
app.use(cookieParser());
app.use(express.urlencoded({ extended: true }));
app.set("view engine", "ejs");

// Swagger configuration
const swaggerOptions = {
  definition: {
    openapi: "3.0.0",
    info: {
      title: "Airbnb Clone API",
      version: "1.0.0",
      description: "API documentation for Airbnb clone project",
    },
    servers: [
      {
        url: "http://localhost:" + port + "/api/g2",
      },
    ],
    components: {
      securitySchemes: {
        bearerAuth: {
          type: "http",
          scheme: "bearer",
          bearerFormat: "JWT",
        },
      },
    },
  },
  apis: ["./routes/*.js"], // scan all route files for @swagger comments
};

const swaggerDocs = swaggerJsDoc(swaggerOptions);
app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerDocs));

//CORS configuration
app.use(
  cors({
    origin: "http://localhost:5173", // frontend origin
    credentials: true,               // allow cookies
  })
);

// Routes
app.use("/api", userRoute);
app.use("/api", listingRoute);
app.use("/api/amenity", amenityRoute);
app.use("/api", bookingRoute);
app.use("/api", paymentRoute);
app.use("/api", reviewRoute);
app.use("/api/wishlist", wishlistRoute);

// Root route
app.get("/api", (req, res) => {
  res.render("index.ejs");
});

// MongoDB connection
mongoose
  .connect(process.env.MONGODB_URL)
  .then(() => console.log("MongoDB connected"))
  .catch((err) => console.log("MongoDB connection error:", err));

// Error handling for unknown routes
app.use((req, res) => {
  res.status(404).json({ message: "Route not found" });
});

// Global error handler
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ message: "Server error", error: err.message });
});

// Start server
app.listen(port, () => {
  console.log(`Server is running at http://localhost:${port}`);
  console.log(`Swagger docs available at http://localhost:${port}/api-docs`);
});
