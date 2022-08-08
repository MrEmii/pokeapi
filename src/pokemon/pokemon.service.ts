import {
  BadRequestException,
  Injectable,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { InjectModel } from '@nestjs/mongoose';
import { isValidObjectId, Model } from 'mongoose';
import { PaginationDTO } from 'src/common/dto/pagination.dto';
import { CreatePokemonDto } from './dto/create-pokemon.dto';
import { UpdatePokemonDto } from './dto/update-pokemon.dto';
import { Pokemon } from './entities/pokemon.entity';

@Injectable()
export class PokemonService {
  private defaultLimit: number;

  constructor(
    @InjectModel(Pokemon.name) private readonly pokemonModel: Model<Pokemon>,
    private readonly configService: ConfigService,
  ) {
    this.defaultLimit = this.configService.getOrThrow<number>('defaultLimit');
  }

  async create(createPokemonDto: CreatePokemonDto) {
    createPokemonDto.name = createPokemonDto.name.toLowerCase();
    try {
      const newPokemon = await this.pokemonModel.create(createPokemonDto);

      return newPokemon;
    } catch (error) {
      this.handleException(error);
    }
  }

  findAll(pagination: PaginationDTO) {
    const { limit = this.defaultLimit, offset = 0 } = pagination;

    return this.pokemonModel
      .find()
      .skip(offset)
      .limit(limit)
      .sort({
        no: 1,
      })
      .select('-__v');
  }

  async findOne(term: string) {
    const pokemon = await this.pokemonModel.findOne({
      ...(!isNaN(+term)
        ? { no: term }
        : isValidObjectId(term)
        ? { _id: term }
        : { name: term }),
    });

    if (!pokemon) throw new NotFoundException('Pokemon not found');

    return pokemon;
  }

  async update(term: string, updatePokemonDto: UpdatePokemonDto) {
    try {
      const pokemon = await this.findOne(term);

      await pokemon.updateOne(updatePokemonDto, { new: true });
      return { ...pokemon.toJSON(), ...updatePokemonDto };
    } catch (error) {
      this.handleException(error);
    }
  }

  async remove(id: string) {
    const { deletedCount } = await this.pokemonModel.deleteMany({
      _id: id,
    });
    if (deletedCount === 0) throw new NotFoundException('Pokemon not found');
    return;
  }

  private handleException(error: any) {
    if (error.code === 11000) {
      throw new BadRequestException(
        `Pokemon already exists with ${JSON.stringify(error.keyValue)}`,
      );
    }
    throw new InternalServerErrorException();
  }
}
