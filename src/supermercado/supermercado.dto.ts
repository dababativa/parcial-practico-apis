import { IsNotEmpty, IsNumber, IsString } from 'class-validator';

export class SupermercadoDto {
  @IsString()
  @IsNotEmpty()
  readonly nombre: string;

  @IsString()
  @IsNotEmpty()
  readonly paginaWeb: string;

  @IsNumber()
  readonly latitud: number;

  @IsNumber()
  readonly longitud: number;
}
