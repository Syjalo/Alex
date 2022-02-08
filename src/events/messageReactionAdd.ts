import { AlexClient } from '../util/AlexClient';
import { ids } from '../util/Constants';

export default (client: AlexClient) => {
  client.on('messageReactionAdd', async (reaction, user) => {
    if (reaction.message.partial) await reaction.message.fetch().catch(() => null);
    if (!reaction.message) return;
    if (user.partial) await user.fetch();
    if (reaction.message.channel.id === ids.channels.suggestions && reaction.message.author!.id === user.id)
      reaction.users.remove(user.id);
  });
};
