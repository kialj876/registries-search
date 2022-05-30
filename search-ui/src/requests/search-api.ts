import { axios } from '@/utils'
import { StatusCodes } from 'http-status-codes'

import { SearchResponseI, SuggestionResponseI } from '@/interfaces'
import { ErrorCategories } from '@/enums'

const AUTO_SUGGEST_RESULT_SIZE = 10

export async function getAutoComplete(searchValue: string): Promise<SuggestionResponseI> {
  if (!searchValue) return

  const url = sessionStorage.getItem('REGISTRY_SEARCH_API_URL')
  if (!url) console.error('Error: REGISTRY_SEARCH_API_URL expected, but not found.')
  const config = { baseURL: url }
  return axios.get<SuggestionResponseI>
  (`businesses/search/suggest?query=${searchValue}&max_results=${AUTO_SUGGEST_RESULT_SIZE}`,
   config)
    .then(response => {
      const data: SuggestionResponseI = response?.data
      if (!data) {
        throw new Error('Invalid API response')
      }
      return data
    }).catch(error => {
      return {
        results: [],
        error: {
          statusCode: error?.response?.status || StatusCodes.NOT_FOUND,
          message: error?.response?.data?.message,
          category: ErrorCategories.SEARCH,
          type: error?.parsed?.rootCause?.type
        }
      }
    })
}

export async function searchBusiness(searchValue: string): Promise<SearchResponseI> {
  if (!searchValue) return
  
  const url = sessionStorage.getItem('REGISTRY_SEARCH_API_URL')
  const config = { baseURL: url }
  return axios.get<SearchResponseI>(`businesses/search/facets?query=${searchValue}&start_row=0&num_of_rows=100`,
   config)
    .then(response => {
      const data: SearchResponseI = response?.data
      if (!data) {
        throw new Error('Invalid API response')
      }
      return data
    }).catch(error => {  
      return {
        results: [],
        error: {
          statusCode: error?.response?.status || StatusCodes.NOT_FOUND,
          message: error?.response?.data?.message,
          category: ErrorCategories.SEARCH,
          type: error?.parsed?.rootCause?.type
        }
      }
    })
}
