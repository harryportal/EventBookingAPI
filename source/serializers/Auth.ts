import { IsDefined, IsEmail, IsNotEmpty, IsOptional, IsPhoneNumber, IsString, Length } from 'class-validator';

export class SignIn {
  @IsEmail()
  email: string;

  @Length(5, 20)
  password: string;
}

export class SignUp extends SignIn {
  @IsDefined()
  firstname: string;

  @IsDefined()
  lastname:string;
}
