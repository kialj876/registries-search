import { ErrorI } from '@/interfaces'
import { BusinessStatuses, BusinessTypes, CorpTypeCd } from '@/enums'

// UI models
export interface SearchI {
  results: SearchResultI[]
  _error: ErrorI
  _loading: boolean
  _value: string
}

export interface SearchResultI {
  name: string
  identifier: string
  bn: string
  status: BusinessStatuses
  legalType: BusinessTypes | CorpTypeCd
}

// api responses
export interface SearchResponseI {
  searchResults: {
    results: Array<SearchResultI>
    totalResults: number
  }
  error?: ErrorI
}
