'use strict'

const {Command} = require('@adonisjs/ace')
const axios = require('axios').default
const cheerio = require('cheerio')
const mm = require('moment')
const Database = use('Database')
const Team = use('App/Models/Team')
const Game = use('App/Models/Game')
const K_HTEAM_ID = 20
const K_ATEAM_ID = 12
const K_GAME_DATE = '2020-11-22'

class Test extends Command {
  static get signature(){
    return 'test'
  }

  static get description(){
    return 'Test adonis'
  }

  async handle(args, options){
    try {
      this.info('Testing adonis')

      let exist_or_new_game = await Game.findOrCreate(
        {
          teamh_id: K_HTEAM_ID, teama_id: K_ATEAM_ID, game_date: K_GAME_DATE
        })
      if (! (exist_or_new_game instanceof Game)) return

      exist_or_new_game.hpoint = 20
      exist_or_new_game.api_save()


      console.log(`After 5 secs we close db, so that process exit; no matter what is running. Time's up!`)
      setTimeout(() => {
        Database.close()
      }, 5000)
    } catch (e) {
      console.error(`error 61: `, e)
    }
  }
}

module.exports = Test
