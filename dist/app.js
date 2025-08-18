"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const routes_1 = __importDefault(require("./app/routes"));
const app = (0, express_1.default)();
app.use(express_1.default.json());
app.use("/api", routes_1.default);
app.get("/", (req, res) => {
    try {
        res.status(200).json({
            success: true,
            message: "Welcome to Library management system",
        });
    }
    catch (error) {
        res.status(500).json({
            success: false,
            message: "Something went wrong",
            error,
        });
    }
});
// Not found route middleware
app.use((req, res, next) => {
    res.status(404).json({
        success: false,
        message: "Route not found",
        error: `Cannot ${req.method} ${req.originalUrl}`,
    });
    next();
});
app.use((err, req, res, _next) => {
    res.status(500).send("Something broke!");
});
exports.default = app;
