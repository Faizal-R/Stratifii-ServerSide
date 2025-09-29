
export interface CandidateDTO {
  _id: string;
  name: string;
  email: string;
  avatar?: string|null;
  resume?: string;
  status: "active" | "pending" | "deactive";
  isBlocked: boolean;
  createdAt?: Date;
  updatedAt?: Date;
}
