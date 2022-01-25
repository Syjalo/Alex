import { AlexClient } from '../util/AlexClient';
import { Ids } from '../util/Constants';

export default (client: AlexClient) => {
  client.on('messageReactionAdd', async (reaction, user) => {
    if (user.partial) await user.fetch();
    if (reaction.message.channel.id === Ids.channels.suggestions && reaction.message.author!.id === user.id)
      reaction.users.remove(user.id);
  });
};
