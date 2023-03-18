import LocalStorageManager from './localStorageManager'
import { StorageKeys } from './enum'

const settingsStorage = new LocalStorageManager(StorageKeys.settings)

export { settingsStorage }
