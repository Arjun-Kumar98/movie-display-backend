import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { uploadToS3 } from '../utils/s3.helper';
import { CreateMovieDto } from './dto/create-movie.dto';
import { UpdateMovieDto } from './dto/update-movie.dto';

@Injectable()
export class MoviesService {
  constructor(private readonly prisma: PrismaService) {}

  async createMovie(data: CreateMovieDto & { image: Express.Multer.File; userId: number }) {
    const { title, publishingYear, userId, image } = data;

    const posterUrl = await uploadToS3(image.buffer, image.originalname, image.mimetype);
    console.log("The poster url is == "+posterUrl);
    return this.prisma.movie.create({
      data: {
        title,
        publishingYear:Number(publishingYear),
        posterUrl,
        userId,
      },
    });
  }

  async updateMovie(data: UpdateMovieDto & { image?: Express.Multer.File;  }) {
    const { title, publishingYear, movieId, image } = data;

    let updatedFields: any = {
      title,
      publishingYear: Number(publishingYear),
    };

    if (image) {
      const newPosterUrl = await uploadToS3(image.buffer, image.originalname, image.mimetype);
      updatedFields.posterUrl = newPosterUrl;
    }

    return this.prisma.movie.update({
      where: {
        id: Number(movieId),
      },
      data: updatedFields,
    });
  }

  async getMovies(params: { userId: number; page: number; limit: number }) {
    const { userId, page = 1, limit = 8 } = params;

    const [movies, totalCount] = await Promise.all([
      this.prisma.movie.findMany({
        where: { userId },
        skip: (page - 1) * limit,
        take: limit,
        orderBy: { id: 'desc' },
      }),
      this.prisma.movie.count({
        where: { userId },
      }),
    ]);

    return {
      movies,
      currentPage: page,
      totalPages: Math.ceil(totalCount / limit),
      totalCount,
    };
  }

  async getMovieById(movieId: number) {
    return this.prisma.movie.findUnique({
      where: { id: movieId },
    });
  }
}
