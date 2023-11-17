import { Module } from '@nestjs/common';
import { SupermercadoService } from './supermercado.service';
import { SupermercadoEntity } from './supermercado.entity';
import { TypeOrmModule } from '@nestjs/typeorm';

@Module({
  imports: [TypeOrmModule.forFeature([SupermercadoEntity])],
  providers: [SupermercadoService],
})
export class SupermercadoModule {}
