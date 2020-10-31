'use strict'

const {Command} = require('@adonisjs/ace')
const axios = require('axios').default
const cheerio = require('cheerio')
const Database = use('Database')
const NFL_URL = 'https://nfl.com/teams/'
const Team = use('App/Models/Team')

class ScrNflTeam extends Command {
  static get signature(){
    return 'scr_nfl_team'
  }

  static get description(){
    return 'Scrape NFL Teams'
  }

  async handle(args, options){
    try {
      this.info('Scrape NFL Teams')
      let nfl_teams = await axios.get(NFL_URL)
      if (! nfl_teams || nfl_teams.status !== 200) return
      const $ = await cheerio.load(nfl_teams.data)
      $('div.d3-o-media-object').each(async (i, team_media) => {
        try {
          const $team_media = await $(team_media)
          const name = await $team_media.find('h4').text().trim()
          let nfl_team_id = await $team_media.find('a[data-link_name="1st CTA View Profile"]').attr('href') // teams/arizona-cardinals/
          nfl_team_id = nfl_team_id.replace('teams/', '').replace(/\//g, '')
          let official_website = await $team_media.find('a[data-link_name="2nd CTA View Full Site"]').attr('href') // teams/arizona-cardinals/
          let logo_nflcom = await $team_media.find('figure.d3-o-media-object__figure source[media="(min-width:1024px)"]').attr('srcset')
          let team = new Team()
          team.name = name
          team.nfl_team_id = nfl_team_id
          team.official_website = official_website
          team.logo_nflcom = logo_nflcom
          console.log(`saving team now`)
          await team.save()
          let a = 1
        } catch (e) {
          console.error(`Error 30: e`)
        }
      })
    } catch (e) {
      console.error(`error: `, e)
    }
  }
}

module.exports = ScrNflTeam
