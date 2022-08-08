import { IsOptional, IsPositive, Min } from 'class-validator';

export class PaginationDTO {
  @IsOptional()
  @IsPositive()
  @Min(1)
  offset?: number;

  @IsOptional()
  @IsPositive()
  limit?: number;
}
