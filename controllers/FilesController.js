/* eslint-disable import/no-named-as-default */
/* eslint-disable no-unused-vars */
import dbClient from '../utils/db.js';
import fs from 'fs';
import { v4 as uuidv4 } from 'uuid';

export default class FilesController {
  static async postUpload(req, res) {
    try {
      const { name, type, parentId = '0', isPublic = false, data } = req.body;
      const userId = req.user._id.toString();

      // Check if name and type are provided
      if (!name) {
        return res.status(400).json({ error: 'Missing name' });
      }
      if (!type || !['folder', 'file', 'image'].includes(type)) {
        return res.status(400).json({ error: 'Missing type' });
      }

      // Check if data is missing for file or image type
      if (type !== 'folder' && !data) {
        return res.status(400).json({ error: 'Missing data' });
      }

      // Check if parentId is set and validate it
      if (parentId !== '0') {
        const parentFile = await dbClient.files.findOne({ _id: parentId });
        if (!parentFile) {
          return res.status(400).json({ error: 'Parent not found' });
        }
        if (parentFile.type !== 'folder') {
          return res.status(400).json({ error: 'Parent is not a folder' });
        }
      }

      let localPath = '';
      if (type !== 'folder') {
        const folderPath = process.env.FOLDER_PATH || '/tmp/files_manager';
        if (!fs.existsSync(folderPath)) {
          fs.mkdirSync(folderPath, { recursive: true });
        }
        const fileName = uuidv4();
        localPath = `${folderPath}/${fileName}`;
        fs.writeFileSync(localPath, Buffer.from(data, 'base64'));
      }

      const newFile = await dbClient.files.insertOne({
        userId,
        name,
        type,
        parentId,
        isPublic,
        localPath,
      });

      res.status(201).json(newFile);
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: 'Internal Server Error' });
    }
  }
}
