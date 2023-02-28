import Dexie from "dexie"
import type { Table } from "dexie"

export interface HistoryData {
  id?: number
  name: string
  age: number
}

export class DexieWithTables extends Dexie {
  history!: Table<HistoryData>

  constructor() {
    super("MyDatabase")
    this.version(1).stores({
      historyData: "++id, text, src, createAt, updateAt, *tags, *categories, *groups"
    })
  }
}

const dbInstance = new DexieWithTables()

export default dbInstance
