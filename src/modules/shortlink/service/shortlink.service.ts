import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { CreateShortlinkDto } from '../dto/create-shortlink.dto';
import { Shortlink, ShortlinkDocument } from '../schemas/shortlink.schema';
import { generateShortlink } from '../utils/link-generator.function';
import { Readable } from 'stream';
import { parse } from 'csv-parse';

@Injectable()
export class ShortlinkService {
    constructor(
        @InjectModel(Shortlink.name) private shortlinkModel: Model<ShortlinkDocument>
    ) {}

    async create(createShortlinkDto: CreateShortlinkDto): Promise<Shortlink> {
        // check db if user enter alias
        if (createShortlinkDto.alias && createShortlinkDto.alias.trim().length) {
            const shortlink = await this.shortlinkModel.find({alias: createShortlinkDto.alias}).exec();
            if (shortlink && shortlink.length) throw 422;
        }

        // create alias if user not enter
        if (!createShortlinkDto.alias || !createShortlinkDto.alias.trim().length) {
            while (true) {
                const newAlias = generateShortlink(7);
                //check nestjs mongoose findfirst
                const gotLink = await this.shortlinkModel.find({alias: newAlias}).exec();
                if (!gotLink.length) {
                    createShortlinkDto.alias = newAlias;
                    break;
                }
            }
        }

        const createdShortlink = new this.shortlinkModel(createShortlinkDto);
        return createdShortlink.save();
    }

    async findUrl(alias: string): Promise<Shortlink> {
        const shortlink = await this.shortlinkModel.find({alias}).exec();
        return shortlink && shortlink[0] ? shortlink[0] : null;
    }

    async uploadFile(file: Express.Multer.File): Promise<void> {
        if (!file) return;
        const stream = Readable.from(file.buffer);
        const urlList = await this.getReadStreamPromise(stream);

        for (const item of urlList) {
            const createShortlinkDto = new CreateShortlinkDto();
            createShortlinkDto.url = item.url;

            const aliasValue = await this.getNewAliasIfNotExist(item.alias.length ? item.alias : null);
            // user entered alias but exist in db 
            if (item.alias.length && !aliasValue) continue;

            createShortlinkDto.alias = aliasValue;

            new this.shortlinkModel(createShortlinkDto).save();
        }
    }

    getReadStreamPromise(stream): Promise<CreateShortlinkDto[]> {
        let list: CreateShortlinkDto[] = [];
        return new Promise((resolve, reject) => {
            stream
                .pipe(parse({ delimiter: ",", from_line: 2 }))
                .on('data', function(chunk) {
                    list = [...list, {
                        url: chunk[0],
                        alias: chunk[1]
                    }]
                })
                .on('error', function(err) {
                    reject(err);
                })
                .on('end', function() {
                    resolve(list);
                })
        })
    }

    async getNewAliasIfNotExist(value: string = null) {
        // return null when user entered value exist
        if (value) {
            const gotLink = await this.shortlinkModel.find({alias: value}).exec();
            if (gotLink.length) return null;
            else return value;
        }

        // for no value, return generated alias
        while (true) {
            const newAlias = generateShortlink(7);
            //check nestjs mongoose findfirst
            const gotLink = await this.shortlinkModel.find({alias: newAlias}).exec();
            if (!gotLink.length) return newAlias;
        }
    }
}
