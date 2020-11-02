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
        let game_date_db = null
        try {
          const $game_date = await $(game_date)
          let game_date_text = await $game_date.text() //Thursday, October 29
          let game_date_mm = mm(game_date_text, 'dddd, MMMM DD')
          if (! game_date_mm.isValid()) {
            return
          }
          game_date_mm.hour(8)
          game_date_db = game_date_mm.format('YYYY-MM-DD')

          //now get sibling div containing list of games
          let div_list_of_games = await $game_date.siblings('div.responsive-table-wrap')
          if (typeof div_list_of_games !== 'object' || ! (div_list_of_games[0])) return
          div_list_of_games = await $(div_list_of_games[0]) //my immediate next sibling

          await div_list_of_games.find('tbody > tr').each(async (i, game_tr) => {//for each game row
            let $game_tr = await $(game_tr)
            let $game_tds = await $($game_tr.find('td'))
            if (! $game_tds || ! $game_tds[0]) return

            let $first_td = $($game_tds[0]) //first td
            let $a_team_name = await $($first_td.find('a.team-name'))
            if ($a_team_name.length !== 1) return
            let a_team_name_abbr = await $a_team_name.find('abbr').attr('title')
            let away_team_found = await Team.findBy('name', a_team_name_abbr)
            if (! away_team_found instanceof Team) return

            if (! $game_tds[1]) return
            let $second_td = $($game_tds[1]) //second td
            $a_team_name = await $($second_td.find('a.team-name'))
            if ($a_team_name.length !== 1) return
            a_team_name_abbr = await $a_team_name.find('abbr').attr('title')
            let home_team_found = await Team.findBy('name', a_team_name_abbr)
            if (! home_team_found instanceof Team) return

            //now that we have hometeam and away team, let's find existing game
            const query = Database.table('users')
            if (username) {
              query.where('username', username)
            }
            let exist_or_new_game = Game.findOrNew(`teamh_id = ${home_team_found.id} AND teama_id = ${away_team_found.id} AND game_date = ${game_date_db}`,
              {
                teamh_id: home_team_found.id, teama_id: away_team_found.id, game_date: game_date_db
              })

            if (! $game_tds[2]) return
            let $third_td = $($game_tds[2]) //third td
            if ($third_td.attr('data-date')) { //upcoming game
              let game_date_time = mm($third_td.attr('data-date').replace('Z', ''), 'YYYY-MM-DDTHH:mm') //2020-11-01T21:05Z
              if (! game_date_time.isValid()) return
            } else {
              let a_result = $third_td.find('a[name="&lpos=nfl:schedule:score"]')
              if (a_result.length === 1) {
                a_result = a_result.text() // ATL 25, CAR 17
                let all_teams_all_points = [] //store all teams' points
                let points = a_result.split(',')
                if (points.length === 2) {
                  let point_1 = points[0].split(' ')
                  if (point_1.length === 2) {
                    all_teams_all_points.push(point_1)
                  }
                  let point_2 = points[0].split(' ')
                  if (point_2.length === 2) {
                    all_teams_all_points.push(point_2)
                  }
                }
                all_teams_all_points.forEach((team_point) => {
                  let team_abbr = team_point[0], point = team_point[1] //ATL 25

                })
              }
              let a = 1

            }
            $a_team_name = await $($second_td.find('a.team-name'))

            let a = 1


          })
        } catch (e) {
          console.error(`Error 57: `, e)
        }
      })
    } catch (e) {
      console.error(`error 61: `, e)
    }
  }
}

module.exports = ScrEspnGame
