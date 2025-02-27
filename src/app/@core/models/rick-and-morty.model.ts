export interface ResourceBase {
    id: number
    name: string
    url: string
    created: string
}

export interface CharacterFilter {
    name?: string
    type?: string
    species?: string
    /**
     * 'Dead' | 'Alive' | 'unknown'
     */
    status?: string
    /**
     * 'Female' | 'Male' | 'Genderless' | 'unknown'
     */
    gender?: string
    page?: number
}

export interface CharacterLocation {
    name: string
    url: string
}

export interface Character extends ResourceBase {
    status: 'Dead' | 'Alive' | 'unknown'
    species: string
    type: string
    gender: 'Female' | 'Male' | 'Genderless' | 'unknown'
    origin: CharacterLocation
    location: CharacterLocation
    image: string
    episode: string[]
}

export interface RickAndMortyApiResponse {
    info: {
      count: number;
      pages: number;
      next: string | null;
      prev: string | null;
    };
    results: Character[];
  }
  
