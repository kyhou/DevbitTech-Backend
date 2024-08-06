import { google } from 'googleapis';
import path from 'path';
import fs from 'fs';
import mime from 'mime-types';
const __dirname = import.meta.dirname;

const getDriveService = () => {
  const KEYFILEPATH = path.join(__dirname, '../config/service.json');
  const SCOPES = ['https://www.googleapis.com/auth/drive'];

  const auth = new google.auth.GoogleAuth({
    keyFile: KEYFILEPATH,
    scopes: SCOPES,
  });
  const driveService = google.drive({ version: 'v3', auth });
  return driveService;
};

const drive = {};
const driveService = getDriveService();

/**
 * 
 * @param {string} fileName File name to upload
 * @param {string} filePath Path to the file to upload
 * @param {string} fileType the extension of file to upload
 * @returns {Promise<string>}
 */
drive.upload = async (fileName, filePath, fileType) => {
  try {
    const res = await driveService.files.create({
      resource: {
        name: fileName,
        parents: [process.env.GDRIVE_FOLDER_ID],
      },
      media: {
        mimeType: mime.lookup(fileType),
        body: fs.createReadStream(filePath),
      },
      permissions: [
        {
          "role": "reader",
          "type": "public"
        }
      ],
      fields: 'id,name',
    });
    return res.data.id;    
  } catch (error) {
    console.error(`Erro ao fazer o upload do arquivo ${fileName}`);
    return "";
  }
};

export default drive;