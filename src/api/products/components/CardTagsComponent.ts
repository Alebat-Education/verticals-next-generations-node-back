import { Entity, PrimaryGeneratedColumn, Column } from 'typeorm';

@Entity('components_cards_card_tags')
export class CardTagsComponent {
  @PrimaryGeneratedColumn()
  id!: number;

  @Column({ type: 'varchar', name: 'left_tag', length: 255, nullable: false })
  leftTag!: string;

  @Column({ name: 'right_tag', type: 'varchar', length: 255, nullable: true })
  rightTag?: string;
}
