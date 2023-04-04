import { Field, InputType, Int } from '@nestjs/graphql';
import { IsString } from 'class-validator';
import {
  IsOptional,
  IsBoolean,
  IsNotEmpty,
  IsInt,
  Min,
  MaxLength,
} from 'class-validator';

@InputType()
export class UpdateTodoInput {
  @Field(() => Int)
  @IsInt()
  @Min(1)
  id: number;

  @Field(() => String, { description: 'What needs to be done', nullable: true })
  @IsString()
  @IsNotEmpty()
  @MaxLength(20)
  @IsOptional()
  description?: string;

  @Field(() => Boolean, { nullable: true, description: 'Done todo?' })
  @IsOptional()
  @IsBoolean()
  done?: boolean;
}
