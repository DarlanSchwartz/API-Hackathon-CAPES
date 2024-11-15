"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const error_types_1 = require("../protocols/error.types");
async function getAll(req, res) {
    return res.send();
}
async function create(req, res) {
    return res.sendStatus(error_types_1.HttpStatus.CREATED);
}
async function edit(req, res) {
    return res.sendStatus(error_types_1.HttpStatus.ACCEPTED);
}
async function remove(req, res) {
    return res.sendStatus(error_types_1.HttpStatus.ACCEPTED);
}
const PostController = { getAll, create, edit, remove };
exports.default = PostController;
