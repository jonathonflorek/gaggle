import { Entity, PrimaryGeneratedColumn, Column, ManyToOne } from 'typeorm';
import { ChatEntity } from './ChatEntity';

@Entity('chat_message')
export class ChatMessageEntity {
    @PrimaryGeneratedColumn()
    public id: number = 0;

    @Column()
    public username: string = '';

    @Column()
    public message: string = '';

    @Column('timestamp')
    public timestamp: Date = undefined as any;

    @ManyToOne(type => ChatEntity, chat => chat.messages)
    public chat: ChatEntity = undefined as any;
}
