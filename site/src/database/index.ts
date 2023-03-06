import Dexie from "dexie"
import type { Table } from "dexie"
import type { History, Config } from "@/types"

export class DexieWithTables extends Dexie {
  history!: Table<History>

  config!: Table<Config>

  constructor() {
    super("QRCode")
    /**
     * 2023/3/6 Bruce Song <recall4056@gmail.com>
     * NOTE:
     * Only declare properties you want to index
     */
    this.version(1).stores({
      history:
        "++id, title, src, content, jsonContent, *tags, *categories, *groups, createAt, updateAt",
      config: "++id, name, description"
    })
  }
}

const IndexDBInstance = new DexieWithTables()

export { IndexDBInstance }
