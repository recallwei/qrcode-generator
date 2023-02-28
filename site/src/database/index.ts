import Dexie from "dexie"
import type { Table } from "dexie"

export interface HistoryData {
  id?: number
  text: string
  src: string
  createAt: string
  updateAt: string
}

export class DexieWithTables extends Dexie {
  historyData!: Table<HistoryData>

  constructor() {
    super("MyDatabase")
    this.version(1).stores({
      historyData: "++id, text, src, createAt, updateAt, *tags, *categories, *groups"
    })
  }
}

const dbInstance = new DexieWithTables()

export default dbInstance
