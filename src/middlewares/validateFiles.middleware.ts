import { Request } from "express";
import multer from "multer";
const uploadAndFilterSingleFile = multer({
  storage: multer.memoryStorage(),
}).single("file");
export default function validateFiles() {
  return uploadAndFilterSingleFile;
}