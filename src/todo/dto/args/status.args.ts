import { ArgsType, Field } from "@nestjs/graphql";
import { IsBoolean, IsOptional } from "class-validator";

@ArgsType()
export class StatusArgs {

  @Field(() => Boolean, { description: "What needs to be done", nullable: true })
  @IsBoolean()
  @IsOptional()
  status?: boolean
}