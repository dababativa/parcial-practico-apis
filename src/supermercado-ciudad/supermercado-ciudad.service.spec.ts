import { Test, TestingModule } from '@nestjs/testing';
import { SupermercadoCiudadService } from './supermercado-ciudad.service';
import { SupermercadoEntity } from '../supermercado/supermercado.entity';
import { CiudadEntity } from '../ciudad/ciudad.entity';
import { TypeOrmTestingConfig } from '../shared/testing-utils/typeorm-testing-config';
import { Repository } from 'typeorm';
import { getRepositoryToken } from '@nestjs/typeorm';
import { faker } from '@faker-js/faker';

describe('SupermercadoCiudadService', () => {
  let service: SupermercadoCiudadService;
  let ciudadRepository: Repository<CiudadEntity>;
  let supermercadoRepository: Repository<SupermercadoEntity>;
  let supermercado: SupermercadoEntity;
  let ciudadesList: CiudadEntity[];
  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [...TypeOrmTestingConfig()],
      providers: [SupermercadoCiudadService],
    }).compile();

    service = module.get<SupermercadoCiudadService>(SupermercadoCiudadService);
    ciudadRepository = module.get<Repository<CiudadEntity>>(
      getRepositoryToken(CiudadEntity),
    );
    supermercadoRepository = module.get<Repository<SupermercadoEntity>>(
      getRepositoryToken(SupermercadoEntity),
    );
    await seedDatabase();
  });

  const seedDatabase = async () => {
    ciudadRepository.clear();
    supermercadoRepository.clear();

    ciudadesList = [];
    for (let i = 0; i < 5; i++) {
      const ciudad: CiudadEntity = await ciudadRepository.save({
        nombre: faker.location.city(),
        pais: 'Argentina',
        numeroHabitantes: faker.number.int(),
        supermercados: [],
      });
      ciudadesList.push(ciudad);
    }

    supermercado = await supermercadoRepository.save({
      nombre: faker.company.name().repeat(10),
      paginaWeb: faker.internet.url(),
      longitud: faker.location.longitude(),
      latitud: faker.location.latitude(),
      ciudades: ciudadesList,
    });
  };

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('addCiudadSupermercado should add an ciudad to a supermercado', async () => {
    const newCiudad: CiudadEntity = await ciudadRepository.save({
      nombre: faker.location.city(),
      pais: 'Argentina',
      numeroHabitantes: faker.number.int(),
      supermercados: [],
    });

    const newSupermercado: SupermercadoEntity =
      await supermercadoRepository.save({
        nombre: faker.company.name().repeat(10),
        paginaWeb: faker.internet.url(),
        longitud: faker.location.longitude(),
        latitud: faker.location.latitude(),
        ciudades: [],
      });

    const result: SupermercadoEntity = await service.addCiudadSupermercado(
      newSupermercado.id,
      newCiudad.id,
    );

    expect(result.ciudades.length).toBe(1);
    expect(result.ciudades[0]).not.toBeNull();
    expect(result.ciudades[0].nombre).toBe(newCiudad.nombre);
    expect(result.ciudades[0].pais).toBe(newCiudad.pais);
    expect(result.ciudades[0].numeroHabitantes).toBe(
      newCiudad.numeroHabitantes,
    );
  });

  it('addCiudadSupermercado should thrown exception for an invalid ciudad', async () => {
    const newSupermercado: SupermercadoEntity =
      await supermercadoRepository.save({
        nombre: faker.company.name().repeat(10),
        paginaWeb: faker.internet.url(),
        longitud: faker.location.longitude(),
        latitud: faker.location.latitude(),
        ciudades: ciudadesList,
      });

    await expect(() =>
      service.addCiudadSupermercado(newSupermercado.id, '0'),
    ).rejects.toHaveProperty(
      'message',
      'The ciudad with the given id was not found',
    );
  });

  it('addCiudadSupermercado should throw an exception for an invalid supermercado', async () => {
    const newCiudad: CiudadEntity = await ciudadRepository.save({
      nombre: faker.location.city(),
      pais: 'Argentina',
      numeroHabitantes: faker.number.int(),
      supermercados: [],
    });

    await expect(() =>
      service.addCiudadSupermercado('0', newCiudad.id),
    ).rejects.toHaveProperty(
      'message',
      'The supermercado with the given id was not found',
    );
  });

  it('findCiudadBySupermercadoIdCiudadId should return ciudad by supermercado', async () => {
    const ciudad: CiudadEntity = ciudadesList[0];
    const storedCiudad: CiudadEntity =
      await service.findCiudadBySupermercadoIdCiudadId(
        supermercado.id,
        ciudad.id,
      );
    expect(storedCiudad).not.toBeNull();
    expect(storedCiudad.nombre).toBe(ciudad.nombre);
    expect(storedCiudad.pais).toBe(ciudad.pais);
    expect(storedCiudad.numeroHabitantes).toBe(ciudad.numeroHabitantes);
  });

  it('findCiudadBySupermercadoIdCiudadId should throw an exception for an invalid ciudad', async () => {
    await expect(() =>
      service.findCiudadBySupermercadoIdCiudadId(supermercado.id, '0'),
    ).rejects.toHaveProperty(
      'message',
      'The ciudad with the given id was not found',
    );
  });

  it('findCiudadBySupermercadoIdCiudadId should throw an exception for an invalid supermercado', async () => {
    const ciudad: CiudadEntity = ciudadesList[0];
    await expect(() =>
      service.findCiudadBySupermercadoIdCiudadId('0', ciudad.id),
    ).rejects.toHaveProperty(
      'message',
      'The supermercado with the given id was not found',
    );
  });

  it('findCiudadBySupermercadoIdCiudadId should throw an exception for an ciudad not associated to the supermercado', async () => {
    const newCiudad: CiudadEntity = await ciudadRepository.save({
      nombre: faker.location.city(),
      pais: 'Argentina',
      numeroHabitantes: faker.number.int(),
      supermercados: [],
    });

    await expect(() =>
      service.findCiudadBySupermercadoIdCiudadId(supermercado.id, newCiudad.id),
    ).rejects.toHaveProperty(
      'message',
      'The ciudad with the given id is not associated to the supermercado',
    );
  });

  it('findCiudadsBySupermercadoId should return ciudades by supermercado', async () => {
    const ciudades: CiudadEntity[] = await service.findCiudadsBySupermercadoId(
      supermercado.id,
    );
    expect(ciudades.length).toBe(5);
  });

  it('findCiudadsBySupermercadoId should throw an exception for an invalid supermercado', async () => {
    await expect(() =>
      service.findCiudadsBySupermercadoId('0'),
    ).rejects.toHaveProperty(
      'message',
      'The supermercado with the given id was not found',
    );
  });

  it('associateCiudadsSupermercado should update ciudades list for a supermercado', async () => {
    const newCiudad: CiudadEntity = await ciudadRepository.save({
      nombre: faker.location.city(),
      pais: 'Argentina',
      numeroHabitantes: faker.number.int(),
      supermercados: [],
    });

    const updatedSupermercado: SupermercadoEntity =
      await service.associateCiudadsSupermercado(supermercado.id, [newCiudad]);
    expect(updatedSupermercado.ciudades.length).toBe(1);

    expect(updatedSupermercado.ciudades[0].nombre).toBe(newCiudad.nombre);
    expect(updatedSupermercado.ciudades[0].pais).toBe(newCiudad.pais);
    expect(updatedSupermercado.ciudades[0].numeroHabitantes).toBe(
      newCiudad.numeroHabitantes,
    );
  });

  it('associateCiudadsSupermercado should throw an exception for an invalid supermercado', async () => {
    const newCiudad: CiudadEntity = await ciudadRepository.save({
      nombre: faker.location.city(),
      pais: 'Argentina',
      numeroHabitantes: faker.number.int(),
      supermercados: [],
    });

    await expect(() =>
      service.associateCiudadsSupermercado('0', [newCiudad]),
    ).rejects.toHaveProperty(
      'message',
      'The supermercado with the given id was not found',
    );
  });

  it('associateCiudadsSupermercado should throw an exception for an invalid ciudad', async () => {
    const newCiudad: CiudadEntity = ciudadesList[0];
    newCiudad.id = '0';

    await expect(() =>
      service.associateCiudadsSupermercado(supermercado.id, [newCiudad]),
    ).rejects.toHaveProperty(
      'message',
      'The ciudad with the given id was not found',
    );
  });

  it('deleteCiudadToSupermercado should remove an ciudad from a supermercado', async () => {
    const ciudad: CiudadEntity = ciudadesList[0];

    await service.deleteCiudadSupermercado(supermercado.id, ciudad.id);

    const storedSupermercado: SupermercadoEntity =
      await supermercadoRepository.findOne({
        where: { id: supermercado.id },
        relations: ['ciudades'],
      });
    const deletedCiudad: CiudadEntity = storedSupermercado.ciudades.find(
      (a) => a.id === ciudad.id,
    );

    expect(deletedCiudad).toBeUndefined();
  });

  it('deleteCiudadToSupermercado should thrown an exception for an invalid ciudad', async () => {
    await expect(() =>
      service.deleteCiudadSupermercado(supermercado.id, '0'),
    ).rejects.toHaveProperty(
      'message',
      'The ciudad with the given id was not found',
    );
  });

  it('deleteCiudadToSupermercado should thrown an exception for an invalid supermercado', async () => {
    const ciudad: CiudadEntity = ciudadesList[0];
    await expect(() =>
      service.deleteCiudadSupermercado('0', ciudad.id),
    ).rejects.toHaveProperty(
      'message',
      'The supermercado with the given id was not found',
    );
  });
  it('deleteCiudadToSupermercado should thrown an exception for an non asocciated ciudad', async () => {
    const newCiudad: CiudadEntity = await ciudadRepository.save({
      nombre: faker.location.city(),
      pais: 'Argentina',
      numeroHabitantes: faker.number.int(),
      supermercados: [],
    });

    await expect(() =>
      service.deleteCiudadSupermercado(supermercado.id, newCiudad.id),
    ).rejects.toHaveProperty(
      'message',
      'The ciudad with the given id is not associated to the supermercado',
    );
  });
});
