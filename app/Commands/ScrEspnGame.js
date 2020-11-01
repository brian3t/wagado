'use strict'

const {Command} = require('@adonisjs/ace')
const axios = require('axios').default
const cheerio = require('cheerio')
const mm = require('moment')
const Database = use('Database')
const SCHED_URL = 'https://www.espn.com/nfl/schedule/'
const Team = use('App/Models/Team')
const Game = use('App/Models/Game')

class ScrEspnGame extends Command {
  static get signature(){
    return 'scr_espn_game'
  }

  static get description(){
    return 'Scrape ESPN NFL Games'
  }

  async handle(args, options){
    try {
      this.info('Scrape ESPN NFL Game Schedule')
      let nfl_scheds = await axios.get(SCHED_URL)
      if (! nfl_scheds || nfl_scheds.status !== 200) return
      const $ = await cheerio.load(nfl_scheds.data)
      $('h2.table-caption').each(async (i, game_date) => {
        try {
          const $game_date = await $(game_date)
          let game_date_text = $game_date.text() //Thursday, October 29
          let game_date_mm = mm(game_date_text, '')

          const name = await $game_date.find('h4').text().trim()
          let nfl_team_id = await $game_date.find('a[data-link_name="1st CTA View Profile"]').attr('href') // teams/arizona-cardinals/
          nfl_team_id = nfl_team_id.replace('teams/', '').replace(/\//g, '')
          let official_website = await $game_date.find('a[data-link_name="2nd CTA View Full Site"]').attr('href') // teams/arizona-cardinals/
          let logo_nflcom = await $game_date.find('figure.d3-o-media-object__figure source[media="(min-width:1024px)"]').attr('srcset')
          let team = new Team()
          team.name = name
          team.nfl_team_id = nfl_team_id
          team.official_website = official_website
          team.logo_nflcom = logo_nflcom
          console.log(`saving team now`)
          await team.save()
          let a = 1
        } catch (e) {
          console.error(`Error 44: `, e)
        }
      })
    } catch (e) {
      console.error(`error 48: `, e)
    }
  }
}

module.exports = ScrEspnGame
