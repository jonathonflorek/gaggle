import { Entity, PrimaryGeneratedColumn, Column, Index, OneToMany } from 'typeorm';
import { ChatMessageEntity } from './ChatMessageEntity';

@Entity('chat')
export class ChatEntity {
    @PrimaryGeneratedColumn()
    public id: number = 0;

    @Column()
    public name: string = '';

    @Column({ type: 'int' })
    public maxSize: number = 0;

    @Column('geometry', { 
        nullable: true,
        spatialFeatureType: 'Point',
        srid: 4326,
    })
    @Index({ spatial: true })
    public location?: {
        type: 'Point';
        coordinates: [number, number];
    };

    @Column('simple-array')
    public tagList: string[] = undefined as any;

    @Column({ type: 'int' })
    public size: number = 0;

    @OneToMany(type => ChatMessageEntity, message => message.chat)
    public messages: ChatMessageEntity[] = undefined as any;
}
