import { Controller, Get, Post, Body, Res, Param, UseInterceptors, CACHE_MANAGER, Inject } from '@nestjs/common';
import { UploadedFile } from '@nestjs/common/decorators';
import { FileInterceptor } from '@nestjs/platform-express';
import { Cache } from 'cache-manager';
import { Response } from 'express';
import { CreateShortlinkDto } from './dto/create-shortlink.dto';
import { ShortlinkService } from './service/shortlink.service';
import { convertResponse } from './utils/convert-response.function';

@Controller('shortlink')
export class ShortlinkController {
    constructor(
        private shortlinkService: ShortlinkService,
        @Inject(CACHE_MANAGER) private cacheManager: Cache
    ) {}

    @Get(':alias')
    async getUrl(@Param('alias') alias: string, @Res() response: Response) {
        const cachedCats: string = await this.cacheManager.get(alias);
        if (cachedCats) return response.redirect(301, cachedCats);

        const link = await this.shortlinkService.findUrl(alias);
        if (!link) return response.send('The url is invalid')
        
        this.cacheManager.set(alias, link.url);

        return response.redirect(301, link.url);
    }

    @Post()
    async create(@Body() createShortlinkDto: CreateShortlinkDto) {
        try {
            const link = await this.shortlinkService.create(createShortlinkDto);
            return convertResponse(200, "Link creation successful", link);
        } catch(error) {
            return convertResponse(error, "Unable to create link, try another!")
        }
    }

    @Post('/upload')
    @UseInterceptors(FileInterceptor('file'))
    async upload(@UploadedFile() file: Express.Multer.File) {
        await this.shortlinkService.uploadFile(file);
    }
}
