import { Module, CacheModule } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ShortlinkModule } from './modules/shortlink/shortlink.module';

@Module({
  imports: [
    MongooseModule.forRoot('mongodb://localhost:27017/TinyUrlClone'),
    ShortlinkModule,
    CacheModule.register({
      isGlobal: true,
    }),
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
