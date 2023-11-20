import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  Param,
  Post,
  Put,
  UseInterceptors,
} from '@nestjs/common';
import { BusinessErrorsInterceptor } from '../shared/interceptors/business-errors/business-errors.interceptor';
import { CiudadSupermercadoService } from './ciudad-supermercado.service';
import { plainToInstance } from 'class-transformer';
import { SupermercadoEntity } from '../supermercado/supermercado.entity';
import { SupermercadoDto } from '../supermercado/supermercado.dto';

@Controller('cities')
@UseInterceptors(BusinessErrorsInterceptor)
export class CiudadSupermercadoController {
  constructor(
    private readonly ciudadSupermercadoService: CiudadSupermercadoService,
  ) {}

  @Post(':ciudadId/supermarkets/:supermercadoId')
  async addSupermercadoCiudad(
    @Param('ciudadId') ciudadId: string,
    @Param('supermercadoId') supermercadoId: string,
  ) {
    return await this.ciudadSupermercadoService.addSupermercadoCiudad(
      ciudadId,
      supermercadoId,
    );
  }

  @Get(':ciudadId/supermarkets/:supermercadoId')
  async findSupermercadoByCiudadIdSupermercadoId(
    @Param('ciudadId') ciudadId: string,
    @Param('supermercadoId') supermercadoId: string,
  ) {
    return await this.ciudadSupermercadoService.findSupermercadoByCiudadIdSupermercadoId(
      ciudadId,
      supermercadoId,
    );
  }

  @Get(':ciudadId/supermarkets')
  async findSupermercadosByCiudadId(@Param('ciudadId') ciudadId: string) {
    return await this.ciudadSupermercadoService.findSupermercadosByCiudadId(
      ciudadId,
    );
  }

  @Put(':ciudadId/supermarkets')
  async associateSupermercadosCiudad(
    @Body() supermercadosDto: SupermercadoDto[],
    @Param('ciudadId') ciudadId: string,
  ) {
    const supermercados = plainToInstance(SupermercadoEntity, supermercadosDto);
    return await this.ciudadSupermercadoService.associateSupermercadosCiudad(
      ciudadId,
      supermercados,
    );
  }

  @Delete(':ciudadId/supermarkets/:supermercadoId')
  @HttpCode(204)
  async deleteSupermercadoCiudad(
    @Param('ciudadId') ciudadId: string,
    @Param('supermercadoId') supermercadoId: string,
  ) {
    return await this.ciudadSupermercadoService.deleteSupermercadoCiudad(
      ciudadId,
      supermercadoId,
    );
  }
}
