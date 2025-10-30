import { Query } from "react-native-appwrite"
import { create } from "zustand"
import { AuthStore } from "./AuthStore"

type query =  {
  query: string
  orderBy: string
  sortBy: string
}
interface QueryProps {
  queries: any[]
  result: any[]
  search: query
  setSearch: (term: any) => void
  setResult: (result: any[]) => void
  setQueries: (type: string) => void
  setSort: (sort: string) => void
}

export const useQueryStore = create<QueryProps>((set, get) => ({
  queries: [],
  result: [],
  search: {
    query: "", 
    orderBy: "", 
    sortBy: ""
  },

  setSearch: (param: string) => set({ search: {...get().search, query: param } }),
  setResult: (result) => set({ result }),
  setSort: (sort: string) => {
    const _sort = sort.split('-')
    set({ search: {...get().search, sortBy: _sort[0], orderBy: _sort[1] } })
  },

  setQueries: (type) => {
    const user = AuthStore.getState().user
    const search = get().search
    if (user) {
      const queries = [Query.and([
        Query.or([
          Query.equal("owner", [user.$id]),
          Query.contains("users", [user.email]),
        ]),
        Query.equal("type", type),
      ])]

      if (search.query) {
        queries.push(Query.contains("name", search.query))
      }

      if (search.orderBy) {
         queries.push( search.orderBy === "asc" ? Query.orderAsc(search.sortBy) : Query.orderDesc(search.sortBy))
      }

      set({ queries })
    }
  },
}))