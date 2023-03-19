import { IsNumber, IsString, IsDateString, Matches, IsOptional, IsNumberString } from 'class-validator';


export class AddEvent {
  @IsString()
  name: string
  
  @IsString()
  description: string

  @IsDateString()
  date: string

  @Matches(/^([01]\d|2[0-3]):([0-5]\d)$/, {
    message: 'Invalid time format. Use the format HH:mm',
  })
  startTime: string

  @Matches(/^([01]\d|2[0-3]):([0-5]\d)$/, {
    message: 'Invalid time format. Use the format HH:mm',
  })
  endTime: string
 
  @IsOptional()
  @IsString()
  location: string

  @IsNumberString()
  totalCapacity: string
  
}

export class AddAttendee{
  @IsString()
  firstname: string

  @IsString()
  email: string

  @IsString()
  lastname: string

  @IsString()
  @IsOptional()
  contact: string

  @IsString()
  @IsOptional()
  address: string

}
