import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { CiudadEntity } from '../ciudad/ciudad.entity';
import { SupermercadoEntity } from '../supermercado/supermercado.entity';
import { Repository } from 'typeorm';
import {
  BusinessError,
  BusinessLogicException,
} from '../shared/errors/business-errors';

@Injectable()
export class SupermercadoCiudadService {
  constructor(
    @InjectRepository(SupermercadoEntity)
    private readonly supermercadoRepository: Repository<SupermercadoEntity>,

    @InjectRepository(CiudadEntity)
    private readonly ciudadRepository: Repository<CiudadEntity>,
  ) {}

  async addCiudadSupermercado(
    supermercadoId: string,
    ciudadId: string,
  ): Promise<SupermercadoEntity> {
    const ciudad: CiudadEntity = await this.ciudadRepository.findOne({
      where: { id: ciudadId },
    });
    if (!ciudad)
      throw new BusinessLogicException(
        'The ciudad with the given id was not found',
        BusinessError.NOT_FOUND,
      );

    const supermercado: SupermercadoEntity =
      await this.supermercadoRepository.findOne({
        where: { id: supermercadoId },
        relations: ['ciudades'],
      });
    if (!supermercado)
      throw new BusinessLogicException(
        'The supermercado with the given id was not found',
        BusinessError.NOT_FOUND,
      );

    supermercado.ciudades = [...supermercado.ciudades, ciudad];
    return await this.supermercadoRepository.save(supermercado);
  }

  async findCiudadBySupermercadoIdCiudadId(
    supermercadoId: string,
    ciudadId: string,
  ): Promise<CiudadEntity> {
    const ciudad: CiudadEntity = await this.ciudadRepository.findOne({
      where: { id: ciudadId },
    });
    if (!ciudad)
      throw new BusinessLogicException(
        'The ciudad with the given id was not found',
        BusinessError.NOT_FOUND,
      );

    const supermercado: SupermercadoEntity =
      await this.supermercadoRepository.findOne({
        where: { id: supermercadoId },
        relations: ['ciudades'],
      });
    if (!supermercado)
      throw new BusinessLogicException(
        'The supermercado with the given id was not found',
        BusinessError.NOT_FOUND,
      );

    const supermercadoCiudad: CiudadEntity = supermercado.ciudades.find(
      (e) => e.id === ciudad.id,
    );

    if (!supermercadoCiudad)
      throw new BusinessLogicException(
        'The ciudad with the given id is not associated to the supermercado',
        BusinessError.PRECONDITION_FAILED,
      );

    return supermercadoCiudad;
  }

  async findCiudadsBySupermercadoId(
    supermercadoId: string,
  ): Promise<CiudadEntity[]> {
    const supermercado: SupermercadoEntity =
      await this.supermercadoRepository.findOne({
        where: { id: supermercadoId },
        relations: ['ciudades'],
      });
    if (!supermercado)
      throw new BusinessLogicException(
        'The supermercado with the given id was not found',
        BusinessError.NOT_FOUND,
      );

    return supermercado.ciudades;
  }

  async associateCiudadsSupermercado(
    supermercadoId: string,
    ciudades: CiudadEntity[],
  ): Promise<SupermercadoEntity> {
    const supermercado: SupermercadoEntity =
      await this.supermercadoRepository.findOne({
        where: { id: supermercadoId },
        relations: ['ciudades'],
      });

    if (!supermercado)
      throw new BusinessLogicException(
        'The supermercado with the given id was not found',
        BusinessError.NOT_FOUND,
      );

    for (let i = 0; i < ciudades.length; i++) {
      const ciudad: CiudadEntity = await this.ciudadRepository.findOne({
        where: { id: ciudades[i].id },
      });
      if (!ciudad)
        throw new BusinessLogicException(
          'The ciudad with the given id was not found',
          BusinessError.NOT_FOUND,
        );
    }

    supermercado.ciudades = ciudades;
    return await this.supermercadoRepository.save(supermercado);
  }

  async deleteCiudadSupermercado(supermercadoId: string, ciudadId: string) {
    const ciudad: CiudadEntity = await this.ciudadRepository.findOne({
      where: { id: ciudadId },
    });
    if (!ciudad)
      throw new BusinessLogicException(
        'The ciudad with the given id was not found',
        BusinessError.NOT_FOUND,
      );

    const supermercado: SupermercadoEntity =
      await this.supermercadoRepository.findOne({
        where: { id: supermercadoId },
        relations: ['ciudades'],
      });
    if (!supermercado)
      throw new BusinessLogicException(
        'The supermercado with the given id was not found',
        BusinessError.NOT_FOUND,
      );

    const supermercadoCiudad: CiudadEntity = supermercado.ciudades.find(
      (e) => e.id === ciudad.id,
    );

    if (!supermercadoCiudad)
      throw new BusinessLogicException(
        'The ciudad with the given id is not associated to the supermercado',
        BusinessError.PRECONDITION_FAILED,
      );

    supermercado.ciudades = supermercado.ciudades.filter(
      (e) => e.id !== ciudadId,
    );
    await this.supermercadoRepository.save(supermercado);
  }
}
