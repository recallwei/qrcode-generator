import Dexie from "dexie"
import type { Table } from "dexie"
import type { History, FormatConfig } from "@/types"

export class DexieWithTables extends Dexie {
  history!: Table<History>

  formatConfig!: Table<FormatConfig>

  constructor() {
    super("QRCode")
    this.version(1).stores({
      history:
        "++id, title, src, content, jsonContent, *tags, *categories, *groups, createAt, updateAt",
      formatConfig: "++id, name, description, *customFields"
    })
  }
}

const IndexDBInstance = new DexieWithTables()

export { IndexDBInstance }
