/* eslint-disable prettier/prettier */
import { CiudadEntity } from '../ciudad/ciudad.entity';
import { Column, Entity, PrimaryGeneratedColumn, ManyToMany } from 'typeorm';

@Entity()
export class SupermercadoEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  nombre: string;

  @Column()
  paginaWeb: string;

  @Column()
  longitud: number;

  @Column()
  latitud: number;

  @ManyToMany(() => CiudadEntity, (ciudad) => ciudad.supermercados)
  ciudades: CiudadEntity[];
}
