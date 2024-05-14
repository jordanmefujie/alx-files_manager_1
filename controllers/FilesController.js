/* eslint-disable import/no-named-as-default */
/* eslint-disable no-unused-vars */
import dbClient from '../utils/db.js';
import fs from 'fs';
import { v4 as uuidv4 } from 'uuid';
import path from 'path';
import mimeTypes from 'mime-types';

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
/* import dbClient from '../utils/db.js'; */

export default class FilesController {
  static async getShow(req, res) {
    try {
      const { id } = req.params;
      const userId = req.user._id.toString();

      const file = await dbClient.files.findOne({ _id: id, userId });
      if (!file) {
        return res.status(404).json({ error: 'Not found' });
      }

      res.status(200).json(file);
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: 'Internal Server Error' });
    }
  }

  static async getIndex(req, res) {
    try {
      const { parentId = '0', page = 0 } = req.query;
      const userId = req.user._id.toString();

      const files = await dbClient.files
        .find({ userId, parentId })
        .skip(page * 20)
        .limit(20)
        .toArray();

      res.status(200).json(files);
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: 'Internal Server Error' });
    }
  }
}
/* import dbClient from '../utils/db.js'; */

export default class FilesController {
  static async putPublish(req, res) {
    try {
      const { id } = req.params;
      const userId = req.user._id.toString();

      const file = await dbClient.files.findOne({ _id: id, userId });
      if (!file) {
        return res.status(404).json({ error: 'Not found' });
      }

      await dbClient.files.updateOne({ _id: id }, { $set: { isPublic: true } });

      res.status(200).json(file);
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: 'Internal Server Error' });
    }
  }

  static async putUnpublish(req, res) {
    try {
      const { id } = req.params;
      const userId = req.user._id.toString();

      const file = await dbClient.files.findOne({ _id: id, userId });
      if (!file) {
        return res.status(404).json({ error: 'Not found' });
      }

      await dbClient.files.updateOne({ _id: id }, { $set: { isPublic: false } });

      res.status(200).json(file);
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: 'Internal Server Error' });
    }
  }
}
/* import fs from 'fs';
* import path from 'path';
* import mimeTypes from 'mime-types';
* import dbClient from '../utils/db.js';
*/

export default class FilesController {
  static async getFile(req, res) {
    try {
      const { id } = req.params;
      const userId = req.user._id.toString();

      const file = await dbClient.files.findOne({ _id: id });
      if (!file) {
        return res.status(404).json({ error: 'Not found' });
      }

      if (!file.isPublic && (!req.user || file.userId !== userId)) {
        return res.status(404).json({ error: 'Not found' });
      }

      if (file.type === 'folder') {
        return res.status(400).json({ error: "A folder doesn't have content" });
      }

      const filePath = path.join(process.env.FOLDER_PATH || '/tmp/files_manager', file.localPath);
      if (!fs.existsSync(filePath)) {
        return res.status(404).json({ error: 'Not found' });
      }

      const mimeType = mimeTypes.lookup(file.name);
      res.setHeader('Content-Type', mimeType);
      const fileStream = fs.createReadStream(filePath);
      fileStream.pipe(res);
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: 'Internal Server Error' });
    }
  }
}
