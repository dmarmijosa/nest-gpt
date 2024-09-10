import { IsString } from 'class-validator';

export class ImageVariationsDto {
  @IsString()
  readonly baseImage: string;
}
