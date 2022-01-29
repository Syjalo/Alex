import { AlexClient } from '../util/AlexClient';
import autocomplete from './_interactionCreate/autocomplete';
import button from './_interactionCreate/button';
import command from './_interactionCreate/command';

export default (client: AlexClient) => {
  client.on('interactionCreate', (interaction) => {
    if (interaction.isAutocomplete()) autocomplete(interaction, client);
    else if (interaction.isButton()) button(interaction, client);
    else if (interaction.isCommand()) command(interaction, client);
  });
};
