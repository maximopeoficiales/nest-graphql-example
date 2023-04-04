import { CreateItemInput } from './create-item.input';
import { InputType, Field, Int, PartialType, Float } from '@nestjs/graphql';
import {
  IsNotEmpty,
  IsPositive,
  IsString,
  IsOptional,
  IsUUID,
} from 'class-validator';

@InputType()
export class UpdateItemInput extends PartialType(CreateItemInput) {
  @Field(() => Int)
  @IsUUID()
  id: string;

  @Field(() => String, { nullable: true })
  @IsNotEmpty()
  @IsString()
  @IsOptional()
  name?: string;

  @Field(() => Float, { nullable: true })
  @IsPositive()
  @IsOptional()
  quantity?: number;

  @Field(() => String, { nullable: true })
  @IsNotEmpty()
  @IsString()
  @IsOptional()
  quantityUnit?: string;
}
