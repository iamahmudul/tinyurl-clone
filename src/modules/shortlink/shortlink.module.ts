import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { ShortlinkService } from './service/shortlink.service';
import { ShortlinkController } from './shortlink.controller';
import { Shortlink, ShortlinkSchema } from './schemas/shortlink.schema';

@Module({
  imports: [MongooseModule.forFeature([{name: Shortlink.name, schema: ShortlinkSchema}])],
  providers: [ShortlinkService],
  controllers: [ShortlinkController],
})
export class ShortlinkModule {}
