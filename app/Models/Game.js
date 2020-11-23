'use strict'

/** @type {typeof import('@adonisjs/lucid/src/Lucid/Model')} */
const Model = use('Model')
const Env = use('Env')

const csservice = require('../../jslib/csservice')
csservice.API_HOST = Env.get('API_HOST')

class Game extends Model {
  static get table () {
    return 'game'
  }

  /**
   * save via API
   * will move to sc service soon
   * future: can use beforeSave hook to auto-call this method too
   * @returns {Promise<void>}
   */
  api_save = async function (){
    if (!(this.isDirty)) {
      console.log(`Nothing to update`)
      return
    }

    let dirty_attrs = this.dirty

    let api_call_res = await csservice.patch(this.constructor.table,this.id, dirty_attrs)
    if (api_call_res.status !== 200) return console.error(`Error updating: `, api_call_res.data)
    this._syncOriginals() //save was successful, so we reset dirty attributes
  }
}

module.exports = Game
