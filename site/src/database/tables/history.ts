import { IndexDBInstance } from "../index"
import type { History } from "@/types"
import { formatCurrentTime } from "@/utils"

export const historyDBManager = {
  get: async (id: number) => {
    await IndexDBInstance.history.get(id)
  },
  add: async (history: History) => {
    await IndexDBInstance.history.add({
      ...history,
      createAt: formatCurrentTime()
    })
  },
  update: async (id: number, changes: object) => {
    await IndexDBInstance.history.update(id, {
      ...changes,
      updateAt: formatCurrentTime()
    })
  },
  delete: async (id: number) => {
    await IndexDBInstance.history.delete(id)
  },
  count: async () => {
    await IndexDBInstance.history.count()
  },
  clear: async () => {
    await IndexDBInstance.history.clear()
  }
}
