import { Module } from '@nestjs/common';
import { SupermercadoCiudadService } from './supermercado-ciudad.service';
import { CiudadEntity } from '../ciudad/ciudad.entity';
import { SupermercadoEntity } from '../supermercado/supermercado.entity';
import { TypeOrmModule } from '@nestjs/typeorm';

@Module({
  imports: [TypeOrmModule.forFeature([CiudadEntity, SupermercadoEntity])],
  providers: [SupermercadoCiudadService],
})
export class SupermercadoCiudadModule {}
