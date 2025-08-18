"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.config = void 0;
const dotenv_1 = __importDefault(require("dotenv"));
const path_1 = __importDefault(require("path"));
// console.log(process.cwd());
dotenv_1.default.config({ path: path_1.default.join(process.cwd(), ".env") });
exports.config = {
    PORT: process.env.PORT,
    DATABSE_URL: process.env.DATABSE_URl,
};
