export default interface IEvent{
  name: string;
  description: string;
  date:Date;
  startTime:string;
  endTime:string;
  location:string;
  timezone:string
  totalCapacity:number;
}