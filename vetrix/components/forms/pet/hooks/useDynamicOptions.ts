"use client"

import { useMemo, useCallback } from "react"
import type { Species, Breed, Color, Sex, SterilizationType } from "@/lib/database/database"
import type { SpeciesOption, BreedOption, ColorOption, SexOption, SterilizationTypeOption } from "../types/PetForm.types"
import { useLazyBreeds } from "./useLazyOptions"

interface UseDynamicOptionsProps {
  species: Species[]
  breeds: Breed[]
  colors: Color[]
  sexes: Sex[]
  sterilizationTypes: SterilizationType[]
  selectedSpeciesId: number | ""
  enableLazyLoading?: boolean
  onBreedsLoad?: (speciesId: number) => Promise<Breed[]>
}

interface UseDynamicOptionsReturn {
  speciesOptions: SpeciesOption[]
  breedOptions: BreedOption[]
  filteredBreeds: BreedOption[]
  colorOptions: ColorOption[]
  sexOptions: SexOption[]
  sterilizationTypeOptions: SterilizationTypeOption[]
  breedsLoading: boolean
  breedsError: string | null
}

export function useDynamicOptions({
  species,
  breeds,
  colors,
  sexes,
  sterilizationTypes,
  selectedSpeciesId,
  enableLazyLoading = true,
  onBreedsLoad
}: UseDynamicOptionsProps): UseDynamicOptionsReturn {
  const defaultFetchBreeds = useCallback(async (speciesId: number): Promise<Breed[]> => {
    await new Promise(resolve => setTimeout(resolve, 300))
    return breeds.filter(breed => breed.speciesId === speciesId)
  }, [breeds])

  const fetchBreeds = onBreedsLoad || defaultFetchBreeds

  const { breeds: lazyBreeds, isLoading: breedsLoading, error: breedsError } = useLazyBreeds(
    enableLazyLoading ? selectedSpeciesId : "",
    fetchBreeds
  )

  const availableBreeds = enableLazyLoading ? lazyBreeds : breeds

  const speciesOptions = useMemo((): SpeciesOption[] => {
    return species.map(s => ({
      id: s.id,
      name: s.name,
      scientificName: s.scientificName
    }))
  }, [species])

  const breedOptions = useMemo((): BreedOption[] => {
    return availableBreeds.map(b => ({
      id: b.id,
      name: b.name,
      speciesId: b.speciesId
    }))
  }, [availableBreeds])

  const filteredBreeds = useMemo((): BreedOption[] => {
    if (!selectedSpeciesId) return []
    
    if (enableLazyLoading) {
      return breedOptions
    } else {
      return breedOptions.filter(breed => breed.speciesId === selectedSpeciesId)
    }
  }, [breedOptions, selectedSpeciesId, enableLazyLoading])

  const colorOptions = useMemo((): ColorOption[] => {
    return colors.map(c => ({
      id: c.id,
      name: c.name,
      hexCode: c.hexCode
    }))
  }, [colors])

  const sexOptions = useMemo((): SexOption[] => {
    return sexes.map(s => ({
      id: s.id,
      name: s.name,
      abbreviation: s.abbreviation
    }))
  }, [sexes])

  const sterilizationTypeOptions = useMemo((): SterilizationTypeOption[] => {
    return sterilizationTypes.map(st => ({
      id: st.id,
      code: st.code,
      description: st.description
    }))
  }, [sterilizationTypes])

  return {
    speciesOptions,
    breedOptions,
    filteredBreeds,
    colorOptions,
    sexOptions,
    sterilizationTypeOptions,
    breedsLoading,
    breedsError
  }
}