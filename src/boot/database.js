import Vue from 'vue'
import Localbase from 'localbase'
let db = new Localbase('quasar-note')
db.config.debug = false

export default db
