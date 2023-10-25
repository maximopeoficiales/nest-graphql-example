import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { SeedResolver } from './seed.resolver';
import { SeedService } from './seed.service';

@Module({
  providers: [SeedResolver, SeedService],
  imports: [ConfigModule],
})
export class SeedModule {}
