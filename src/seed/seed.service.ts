import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';

import { Model } from 'mongoose';
import { AxiosAdapter } from 'src/common/adapters/axios.adapter';
import { CreatePokemonDto } from 'src/pokemon/dto/create-pokemon.dto';
import { Pokemon } from 'src/pokemon/entities/pokemon.entity';
import { Pokemons } from './interfaces/pokemons.interface';

@Injectable()
export class SeedService {
  constructor(
    @InjectModel(Pokemon.name) private readonly pokemonModel: Model<Pokemon>,
    private readonly axios: AxiosAdapter,
  ) {}

  async executeSeed() {
    await this.pokemonModel.deleteMany({});

    const data = await this.axios.get<Pokemons>(
      'https://pokeapi.co/api/v2/pokemon?limit=300',
    );

    const pokemonToInsert: CreatePokemonDto[] = [];

    data.results.forEach((pokemon) => {
      const segments = pokemon.url.split('/');
      const no = +segments[segments.length - 2];

      pokemonToInsert.push({
        name: pokemon.name,
        no,
      });
    });

    await this.pokemonModel.insertMany(pokemonToInsert);

    return data.results;
  }
}
