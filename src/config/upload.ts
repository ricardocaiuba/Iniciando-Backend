import path from "path";
import crypto from "crypto";
import multer from "multer";

const tmpFolter = path.resolve(__dirname, "..", "..", "tmp");
const uploadsFolder = path.resolve(tmpFolter, "uploads");

export default {
  tmpFolter: tmpFolter,
  uploadsFolder: uploadsFolder,

  storage: multer.diskStorage({
    destination: tmpFolter,
    filename(request, file, callback) {
      const fileHash = crypto.randomBytes(10).toString("hex");
      const fileName = `${fileHash}-${file.originalname}`;

      return callback(null, fileName);
    },
  }),
};
