

export interface IInterviewSlot  {
  startTime: Date;
  endTime: Date;
  duration: number;
  isAvailable: boolean;
  status: 'available' | 'booked' | 'completed' | 'cancelled' | 'expired';
  bookedBy?: string | null ;
  ruleId?: string;

}



