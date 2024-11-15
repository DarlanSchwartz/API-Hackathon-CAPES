"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const posts_routes_1 = __importDefault(require("./posts.routes"));
const MainRouter = (0, express_1.Router)();
MainRouter.use(posts_routes_1.default);
exports.default = MainRouter;
