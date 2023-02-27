import { ObjectId } from 'mongodb';
import { getPathFile } from 'src/file/helpers';
import { Injectable } from '@nestjs/common';
import { FileEntity } from '../entity/file.entity';
import { path } from 'app-root-path';
import { ensureDir, writeFile, remove } from 'fs-extra';
import { PathFiles, RootPathFilesFolder } from '../constans';
import { InjectModel } from 'nestjs-typegoose';
import { AuthorTypeFile, FileModel, FileType } from '../file.model';
import { ModelType } from '@typegoose/typegoose/lib/types';
import { getPathByAuthorType } from '../helpers';
@Injectable()
export class FileService {
  constructor(
    @InjectModel(FileModel) private readonly fileModel: ModelType<FileModel>,
  ) {}

  async deleteOne(id: ObjectId) {
    const file = await this.fileModel.findByIdAndRemove(id).exec();

    await remove(getPathFile(file).replace('/', ''));
    return true;
  }

  async deleteMany(ids: ObjectId[]) {
    for (const id of ids) {
      await this.deleteOne(id);
    }
  }

  async saveFiles(files: Express.Multer.File[], typeAuthor: AuthorTypeFile) {
    try {
      const savesFiles: FileModel[] = await Promise.all(
        files.map(async (file) => {
          const uploadFolder = `${PathFiles}/${getPathByAuthorType(
            typeAuthor,
            file.mimetype,
          )}`;

          await ensureDir(uploadFolder);

          await writeFile(`${uploadFolder}/${file.originalname}`, file.buffer);

          const newFile = await this.fileModel.create({
            size: file.size,
            name: file.originalname,
            type: file.mimetype,
            authorType: typeAuthor,
          });

          return newFile.toObject();
        }),
      );
      return savesFiles.map((file) => file._id);
    } catch (e) {
      console.warn('error in create files', e);
    }
  }
}
