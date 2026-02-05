export interface RoleScores {
  apostle: number;
  prophet: number;
  evangelist: number;
  herder: number;
  teacher: number;
}

export interface UserResults {
  scores: RoleScores;
  profile: {
    // ... profile data
    [key: string]: any;
  };
}

export interface Team {
  id: number;
  name: string;
  createdById: number;
  plan: 'free' | 'pro' | 'proplus';
  inviteCode: string;
  churchId?: number;
  description?: string;
  // ... other team fields
  [key: string]: any;
}

export interface UserTeams {
  leadTeams?: Team[];
  memberTeams?: Team[];
}

// Type alias for when teams are returned as array
export type TeamsArray = Team[];

export interface TeamMember {
  id: number;
  userId: number;
  name: string;
  email: string;
  teamId: number;
  role?: string;
  profile?: {
    apostle: number;
    prophet: number;
    evangelist: number;
    herder: number;
    teacher: number;
  };
  scores?: RoleScores; // Legacy support
  [key: string]: any;
}

export interface TeamResults {
  results: Array<{
    userId: number;
    scores: RoleScores;
    [key: string]: any;
  }>;
  members: TeamMember[];
  aggregatedScores?: RoleScores;
  totalScores?: RoleScores;
  averageScores?: RoleScores;
}

export interface TeamSummary {
  id: number;
  name: string;
  roleDistribution: RoleScores;
  memberCount: number;
  [key: string]: any;
}

export interface ChurchSummary {
  id: number;
  name: string;
  city: string;
  denomination: string;
  logoUrl?: string;
  totalTeams?: number; // From dashboard response
  totalMembers?: number; // From dashboard response
  location?: string;
  // ... other church fields
  [key: string]: any;
}

export interface ChurchDashboardResponse {
  church: ChurchSummary;
  teams: TeamSummary[];
  aggregatedScores: RoleScores;
  totalScores: RoleScores;
  averageScores: RoleScores;
}

export interface ChurchMember {
  id: number;
  userId: number;
  name: string;
  email: string;
  churchId: number;
  teamId?: number;
  role?: string;
  scores?: RoleScores;
  [key: string]: any;
}

export interface UserProfile {
  profile: {
    [key: string]: any;
  };
  scores: RoleScores;
}

export interface ChurchStats {
  stats: {
    totalChurches?: number;
    totalMembers?: number;
    totalTeams?: number;
    [key: string]: any;
  };
}

