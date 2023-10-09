const { google } = require('googleapis');
const path = require('path');
const fs = require('fs');
const mime = require('mime-types')

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

const drive = getDriveService();

/**
 * 
 * @param {string} fileName File name to upload
 * @param {string} filePath Path to the file to upload
 * @param {string} fileType the extension of file to upload
 * @returns {Promisse<string>}
 */
const upload = async (fileName, filePath, fileType) => {
  let res = await drive.files.create({
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

  if (res) {
    return res.data.id;
  } else {
    console.error(`Erro ao fazer o upload do arquivo ${fileName}`);
    return "";
  }
};

exports.upload = upload;