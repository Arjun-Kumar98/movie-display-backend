import {
  Controller,
  Post,
  UseInterceptors,
  UploadedFile,
  Body,
  Req,
  Res,
  HttpStatus,
  Put,
  Get,
  Query,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { MoviesService } from './movies.service';
import { CreateMovieDto } from './dto/create-movie.dto';
import { UpdateMovieDto } from './dto/update-movie.dto';
import { Request, Response } from 'express';
import { validateToken } from 'src/middleware/auth.middleware';
import { setCorsHeaders } from '../middleware/cors.middleware';
import { Param } from '@nestjs/common';

@Controller('movies')
export class MoviesController {
  constructor(private readonly moviesService: MoviesService) {}

  @Post('upload')
  @UseInterceptors(FileInterceptor('image'))
  async uploadMovie(
    @UploadedFile() image: Express.Multer.File,
    @Body() body: CreateMovieDto,
    @Req() req: Request,
    @Res() res: Response,
  ) {
    const auth = validateToken(req);

    if (!auth.success) {
      res.set(setCorsHeaders());
      return res.status(auth.status || HttpStatus.UNAUTHORIZED).json({ error: auth.message });
    }

    try {
      const result = await this.moviesService.createMovie({
        ...body,
        image,
        userId: auth.userId!,
      });

      res.set(setCorsHeaders());
      return res.status(HttpStatus.CREATED).json(result);
    } catch (error) {
      res.set(setCorsHeaders());
      return res
        .status(HttpStatus.INTERNAL_SERVER_ERROR)
        .json({ error: 'Failed to upload movie' });
    }
  }

  @Put('update')
  @UseInterceptors(FileInterceptor('image'))
  async updateMovie(
    @UploadedFile() image: Express.Multer.File,
    @Body() body: UpdateMovieDto,
    @Req() req: Request,
    @Res() res: Response,
  ) {
    const auth = validateToken(req);


    if (!auth.success) {
      res.set(setCorsHeaders());
      return res.status(auth.status || HttpStatus.UNAUTHORIZED).json({ error: auth.message });
    }

    try {
      const result = await this.moviesService.updateMovie({
        ...body,
        image,
  
      });

      res.set(setCorsHeaders());
      return res.status(HttpStatus.OK).json(result);
    } catch (error) {
      res.set(setCorsHeaders());
      return res
        .status(HttpStatus.INTERNAL_SERVER_ERROR)
        .json({ error: 'Failed to update movie' });
    }
  }

  @Get('list')
  async getMovies(
    @Query('userId') userId: string,
    @Query('page') page = '1',
    @Query('limit') limit = '8',
    @Req() req: Request,
    @Res() res: Response,
  ) {
    const auth = validateToken(req);
   

    if (!auth.success) {
      res.set(setCorsHeaders());
      return res.status(auth.status || HttpStatus.UNAUTHORIZED).json({ error: auth.message });
    }

    try {
      const result = await this.moviesService.getMovies({
        userId: Number(userId),
        page: Number(page),
        limit: Number(limit),
      });

      res.set(setCorsHeaders());
      return res.status(HttpStatus.OK).json(result);
    } catch (error) {
      res.set(setCorsHeaders());
      return res
        .status(HttpStatus.INTERNAL_SERVER_ERROR)
        .json({ error: 'Failed to fetch movies' });
    }
  }

  @Get('detail/:movieId')
  async getMovieById(
    @Param('movieId') movieId: string,
    @Req() req: Request,
    @Res() res: Response,
  ) {
    const auth = validateToken(req);

    if (!auth.success) {
      res.set(setCorsHeaders());
      return res.status(auth.status || HttpStatus.UNAUTHORIZED).json({ error: auth.message });
    }

    try {
      const movie = await this.moviesService.getMovieById(Number(movieId));

      res.set(setCorsHeaders());
      return res.status(HttpStatus.OK).json({ movie });
    } catch (error) {
      res.set(setCorsHeaders());
      return res
        .status(HttpStatus.INTERNAL_SERVER_ERROR)
        .json({ error: 'Failed to get movie details' });
    }
  }
}
