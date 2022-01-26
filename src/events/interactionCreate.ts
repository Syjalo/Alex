import { AlexClient } from '../util/AlexClient';
import autocomplete from './_interactionCreate/autocomplete';
import command from './_interactionCreate/command';

export default (client: AlexClient) => {
  client.on('interactionCreate', (interaction) => {
    if (interaction.isAutocomplete()) autocomplete(interaction, client);
    else if (interaction.isCommand()) command(interaction, client);
  });
};
