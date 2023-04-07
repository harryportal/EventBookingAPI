import { IsEmail, IsPhoneNumber, IsString, Length } from 'class-validator';

export class SignIn {
  @IsEmail()
  email: string;

  @IsString()
  @Length(5, 20)
  password: string;
}

export class SignUp extends SignIn {
  @IsString()
  firstname: string;

  @IsString()
  lastname:string;

  @IsPhoneNumber()
  contact: string;

}
