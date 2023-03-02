import Dexie from "dexie"
import type { Table } from "dexie"
import type { History } from "@/types"

export class DexieWithTables extends Dexie {
  history!: Table<History>

  constructor() {
    super("QRCode")
    this.version(1).stores({
      history:
        "++id, text, src, jsonString, jsonObject, *tags, *categories, *groups, createAt, updateAt"
    })
  }
}

const IndexDBInstance = new DexieWithTables()

export { IndexDBInstance }