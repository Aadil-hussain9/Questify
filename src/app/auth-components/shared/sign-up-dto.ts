export interface SignupData {
  // Step 1
  email: string;
  name: string;
  password: string;

  // Step 2
  country: string;
  state: string;
  avatar: string;

  // Step 3
  skills: Array<{
    name: string;
    level: string;
  }>;

  // Step 4
  languages: string[];
  bio: string;
}
