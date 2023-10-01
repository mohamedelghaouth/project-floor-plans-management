import { Project } from 'src/project/project.entity';
import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
export class FloorPlan {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  name: string;

  @ManyToOne(() => Project, (project) => project.floorPlans, {
    onDelete: 'CASCADE',
  })
  project: Project;

  @Column({
    type: 'bytea',
  })
  originalFile: Uint8Array;

  @Column({
    type: 'bytea',
  })
  smallerVersionOfOriginalFile: Uint8Array;

  @Column({
    type: 'bytea',
  })
  biggerVersionOfOriginalFile: Uint8Array;
}
