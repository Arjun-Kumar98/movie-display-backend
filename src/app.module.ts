import { Module } from '@nestjs/common';
import { AuthModule } from './auth/auth.module';
import { MoviesModule } from './movies/movies.module';
import { PrismaService } from './prisma/prisma.service';

@Module({
  imports: [AuthModule, MoviesModule],
  providers: [PrismaService],
})
export class AppModule {}
