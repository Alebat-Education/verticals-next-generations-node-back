import { PrimaryGeneratedColumn, Column } from 'typeorm';

export abstract class BaseComponentEntity {
  @PrimaryGeneratedColumn()
  id!: number;

  @Column({ name: 'cmp_id', type: 'int', unsigned: true, nullable: false })
  cmpId!: number;

  @Column({ name: 'component_type', type: 'varchar', length: 255, nullable: false })
  componentType!: string;

  @Column({ type: 'varchar', length: 255, nullable: false })
  field!: string;

  @Column({ type: 'int', nullable: true, unsigned: true })
  order?: number;
}
