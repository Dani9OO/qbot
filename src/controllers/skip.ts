import { MessageEmbed } from 'discord.js';
import { roles } from './../config/role';
import { CommandModel } from '../models/command';
import { Command } from '../interfaces/command';
import { queue } from '../models/queue';

export class SkipCommand implements Command {
    readonly aliases = ['skip', 'next'];
    readonly permission = roles.qbitor;

    getHelpMessage(): string {
        return `I can play the next song if there is one.`;
    }

    async run(command: CommandModel): Promise<void> {
        if (command.rawMessage.member?.voice.channel) {
            try {
                const nextSong = queue.skip();
                queue.play(nextSong, command.rawMessage.channel);
            } catch (error) {
                await command.rawMessage.channel.send(
                    new MessageEmbed()
                    .setTitle('How am I supposed to sing!?')
                    .setDescription(error.message)
                );
            }
        } else {
            await command.rawMessage.channel.send(
                new MessageEmbed()
                .setTitle('You can only play music in a voice channel')
                .setDescription('Connect to a voice channel so I can sing you a song')
            );
        }
    }

    hasPermissionToRun(commandModel: CommandModel): boolean {
        if (!this.permission) return true;
        return commandModel.rawMessage.member!.roles.cache.some(
            (r) => r.name === this.permission,
        );
    }
}
