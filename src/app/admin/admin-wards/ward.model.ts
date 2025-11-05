export interface Ward {
  _id: string;       // Changed from id to _id to match MongoDB's default
  wardNumber: number;
  taluk: string;
  district: string;
  state: string;
  country: string;
  imageUrl: string;
}