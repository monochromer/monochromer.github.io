import type { ComponentType, JSX } from 'preact'

export type DataType = {
  [key: string]: any
}

export type FunctionsType = {
  [key: string]: Function
}

export type EleventyContextType = {
  data: DataType
  functions: FunctionsType
} | null

export type PageComponent<T> = ComponentType<{
  data: DataType & T
}>

type ElementsType = keyof JSX.IntrinsicElements

export type HtmlElementstoComponentsMap = {
  [key in ElementsType]: ComponentType<JSX.IntrinsicElements[key]>
}