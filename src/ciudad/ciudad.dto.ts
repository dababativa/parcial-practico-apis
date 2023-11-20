import { IsNotEmpty, IsNumber, IsPositive, IsString } from 'class-validator';

export class CiudadDto {
  @IsString()
  @IsNotEmpty()
  readonly nombre: string;

  @IsString()
  @IsNotEmpty()
  readonly pais: string;

  @IsNumber()
  @IsPositive()
  readonly numeroHabitantes: number;
}
