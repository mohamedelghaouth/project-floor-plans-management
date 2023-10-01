import { FloorPlan } from 'src/floorplans/floorplans.entity';
import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
export class Project {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  name: string;

  @OneToMany(() => FloorPlan, (floorPlans) => floorPlans.project, {
    eager: true,
    cascade: ["insert"]
  })
  floorPlans: FloorPlan[]
}
