import { IsNotEmpty, IsNumber, IsString, Max, Min, IsDateString } from 'class-validator';

export default class ProductRating {
  @IsString()
  @IsNotEmpty()
  content: string;

  @Min(1)
  @Max(5)
  @IsNumber()
  rating: number;
}

export class AddEvent {
  name: string
  description: string
  date: string
  startTime: string
  endTime: string
  location: string
  totalCapacity: string
}

