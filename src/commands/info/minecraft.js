const Discord = require('discord.js')
const Command = require('../../structures/Command')
const CommandOption = require('../../structures/CommandOption')
const fetch = require('node-fetch')
const CommandError = require('../../errors/CommandError')

const makeFields = (pages, interaction, pageNumber) => {
  const fields = []
  const page = pages[pageNumber]
  page.forEach(n => {
    const username = n.name.replace('_', '\\_')
    fields.push({ name: username, value: `${n.changedToAt ? interaction.client.getDateToLocaleString(n.changedToAt, interaction) : interaction.client.getString('minecraft.firstName', { locale: interaction })}` })
  })
  return fields
}

const getEmbed = (username, uuid, pages, interaction, page, status) => {
  const embed = new Discord.MessageEmbed()
  .setTitle(interaction.client.getString('minecraft.title', { locale: interaction, variables: { username } }))
  .setThumbnail(`https://mc-heads.net/body/${uuid}/left`)
  .setFooter(interaction.client.getString('global.pageNumber', { locale: interaction, variables: { current: page + 1, total: pages.length } }))
  .setColor('BLURPLE')
  if (status && page === 0) {
    const statuses = {
      new_msa: 'newMSA',
      migrated_msa: 'migratedMSA',
      msa: 'MSA',
      mojang: 'mojang',
      legacy: 'legacy'
    }
    if (statuses.hasOwnProperty(status)) status = interaction.client.getString(`minecraft.accountType.${statuses[status]}`, { locale: interaction })
    else status = interaction.client.getString(`minecraft.accountType.unknown`, { locale: interaction })
    embed.addField('Account type', status)
  }
  embed.addFields(makeFields(pages, interaction, page))
  return embed
}

const updateComponents = (row, page, pages) => {
  if (page === 0) {
    row.components.forEach(com => {
      if (com.customID === 'first' || com.customID === 'previous') com.setDisabled(true)
      else com.setDisabled(false)
    })
  } else if (page === pages?.length - 1) {
    row.components.forEach(com => {
      if (com.customID === 'next' || com.customID === 'last') com.setDisabled(true)
      else com.setDisabled(false)
    })
  } else if (Number.isInteger(page)) {
    row.components.forEach(com => {
      com.setDisabled(false)
    })
  } else {
    row.components.forEach(com => {
      com.setDisabled(true)
    })
  }
  return row
}

module.exports = new Command()
.setName('minecraft')
.setDescription('Shows information about the specified player')
.setCategory('info')
.setCooldown(10)
.setMaxUsageAmount(2)
.setOptions([
  new CommandOption()
  .setType('STRING')
  .setName('player')
  .setDescription('Username or UUID of the player')
  .setRequired()
])
.setFunction(async (interaction, client) => {
  const instance = interaction.options?.first()?.value
  if (!instance) return

  const rx = /([0-9a-f]{8})(?:-|)([0-9a-f]{4})(?:-|)(4[0-9a-f]{3})(?:-|)([89ab][0-9a-f]{3})(?:-|)([0-9a-f]{12})/
  let uuid = rx.exec(instance)?.[0]
  if (!uuid) {
    if (2 <= instance.length && instance.length <= 16) {
      const res = await fetch(`https://api.mojang.com/users/profiles/minecraft/${instance}`)
      .then(r => r.json())
      .catch(async err => {
        if (err instanceof fetch.FetchError) {
          throw new CommandError(client)
          .setMessageStringPath('errors.falsePlayer.message')
        } else throw err
      })
      uuid = res.id
    } else {
      throw new CommandError(client)
      .setMessageStringPath('errors.invalidPlayer.message')
    }
  }
  const res = await fetch(`https://api.mojang.com/user/profiles/${uuid}/names`)
  .then(r => r.json())
  .then(json => json.reverse())
  .catch(async err => {
    if (err instanceof fetch.FetchError) {
      
      throw new CommandError(client)
      .setMessageStringPath('errors.falsePlayer.message')
    } else throw err
  })
  const { status } = await fetch(`https://api.gapple.pw/status/${res[0].name}`)
  .then(r => r.json())
  .catch(() => { return { status: null } })
  const username = res[0].name.replace('_', '\\_')
  const pages = []
  for (let i = 0; i < res.length / 8; i++) {
    const cache = []
    for (let j = 0; j < 8; j++) {
      if (res[i*8+j]) cache.push(res[i*8+j])
    }
    pages.push(cache)
  }
  let page = 0
  if (pages.length === 1) {
    client.interactionSend(interaction, { embeds: [getEmbed(username, uuid, pages, interaction, page, status)] })
  } else {
    const row = new Discord.MessageActionRow()
    .addComponents(
      new Discord.MessageButton()
      .setCustomID('first')
      .setEmoji('⏮️')
      .setLabel(client.getString('global.buttons.firstPage', { locale: interaction }))
      .setStyle('PRIMARY'),
      new Discord.MessageButton()
      .setCustomID('previous')
      .setEmoji('⏪')
      .setLabel(client.getString('global.buttons.previousPage', { locale: interaction }))
      .setStyle('PRIMARY'),
      new Discord.MessageButton()
      .setCustomID('next')
      .setEmoji('⏩')
      .setLabel(client.getString('global.buttons.nextPage', { locale: interaction }))
      .setStyle('PRIMARY'),
      new Discord.MessageButton()
      .setCustomID('last')
      .setEmoji('⏭️')
      .setLabel(client.getString('global.buttons.lastPage', { locale: interaction }))
      .setStyle('PRIMARY')
    )
    client.interactionSend(interaction, { embeds: [getEmbed(username, uuid, pages, interaction, page, status)], components: [updateComponents(row, page, pages)] })
    const message = await interaction.fetchReply()
    const collector = message.createMessageComponentInteractionCollector({ filter: button => button.user.id === interaction.user.id, time: (() => {let time = 30000 + 20000 * (pages.length - 1); if (time > 300000) time = 300000; return time})() })
    collector.on('collect', button => {
      button.deferUpdate()
      if (button.customID === 'first') page = 0
      else if (button.customID === 'previous') page--; if (page < 0) page = 0
      else if (button.customID === 'next') page++; if (page > pages.length - 1) page = pages.length - 1
      else if (button.customID === 'last') page = pages.length - 1
      interaction.editReply({ embeds: [getEmbed(username, uuid, pages, interaction, page, status)], components: [updateComponents(row, page, pages)] })
    })
    collector.on('end', () => {
      interaction.editReply({ embeds: [getEmbed(username, uuid, pages, interaction, page, status)], components: [updateComponents(row)] })
    })
  }
})