import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useQuery, useMutation } from '@tanstack/react-query';
import { teamsApi } from '@/lib/api/teams';
import { churchesApi } from '@/lib/api/churches';
import { useAuth } from '@/contexts/AuthContext';
import { Team } from '@/lib/types/dashboard';

// Types for responses
type JoinType = 'team' | 'church';

interface UseJoinFlowProps {
  inviteCode: string;
  type: JoinType;
}

// Simple error logger
const logError = (error: any, context: string = "") => {
  try {
    const timestamp = new Date().toISOString();
    const message = error instanceof Error ? error.message : String(error);
    const stack = error instanceof Error ? error.stack : "No stack available";
    
    console.error(`[${timestamp}] ERROR in ${context}:`, {
      message,
      stack,
      url: typeof window !== 'undefined' ? window.location.href : 'SSR',
    });
  } catch (loggingError) {
    console.error("Error in error logger:", loggingError);
  }
};

export function useJoinFlow({ inviteCode, type }: UseJoinFlowProps) {
  const router = useRouter();
  const { user } = useAuth();
  
  const [isCheckingMembership, setIsCheckingMembership] = useState(false);
  const [inviteProcessed, setInviteProcessed] = useState(false);
  const [isJoining, setIsJoining] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  // 1. Fetch Entity (Team or Church)
  const { 
    data: entityData, 
    isLoading: isLoadingEntity, 
    error: entityError 
  } = useQuery({
    queryKey: [type === 'church' ? 'churches' : 'teams', 'by-invite', inviteCode],
    queryFn: async () => {
      if (type === 'church') {
        return churchesApi.getByInviteCode(inviteCode);
      } else {
        return teamsApi.getByInviteCode(inviteCode);
      }
    },
    enabled: !!inviteCode,
    retry: 1,
  });

  // Extract the actual entity object
  const entity = type === 'church' 
    ? (entityData as any)?.church 
    : (entityData as any)?.team;

  // Fuzzy match check
  useEffect(() => {
    if (entity && entity.inviteCode && inviteCode) {
      if (entity.inviteCode.toLowerCase() !== inviteCode.toLowerCase()) {
        console.log(`[JoinFlow] Invite code corrected: ${inviteCode} -> ${entity.inviteCode}`);
        // In a real app we might show a toast here
      }
    }
  }, [entity, inviteCode]);

  // 2. Join Mutation
  const joinMutation = useMutation({
    mutationFn: async () => {
      if (type === 'church') {
        return churchesApi.joinByInviteCode(inviteCode);
      } else {
        return teamsApi.joinByInviteCode(inviteCode);
      }
    },
    onSuccess: () => {
      setSuccessMessage(type === 'church' ? 'Succesvol lid geworden van de kerk!' : 'Succesvol lid geworden van het team!');
      setInviteProcessed(true);
      
      // Clear storage
      localStorage.removeItem("pendingInviteCode");
      localStorage.removeItem("inviteType");

      // Redirect after delay
      setTimeout(() => {
        router.push('/dashboard/questionnaire/start');
      }, 1500);
    },
    onError: (err: any) => {
      logError(err, 'JoinFlow:Mutation');
      let msg = err.message || "Er is een onbekende fout opgetreden.";
      
      if (msg.toLowerCase().includes("already_church_member")) {
        msg = "Je bent al lid van deze kerk.";
      } else if (msg.toLowerCase().includes("limit_reached")) {
        msg = "De limiet van gebruikers is bereikt.";
      }
      
      setError(msg);
      setIsJoining(false);
    }
  });

  // 3. Auto-join logic
  const handleJoin = () => {
    if (!inviteCode) {
      setError("Geen uitnodigingscode gevonden.");
      return;
    }

    if (!user) {
      // Save for after login
      localStorage.setItem("pendingInviteCode", inviteCode);
      localStorage.setItem("inviteType", type);
      
      const redirectPath = type === 'church' 
        ? `/join-church/${inviteCode}` 
        : `/join/${inviteCode}`;
        
      router.push(`/auth?redirect=${encodeURIComponent(redirectPath)}`);
      return;
    }

    setIsJoining(true);
    joinMutation.mutate();
  };

  // Check for pending invite on mount/user load
  useEffect(() => {
    const pendingCode = localStorage.getItem("pendingInviteCode");
    const pendingType = localStorage.getItem("inviteType");

    if (user && pendingCode === inviteCode && pendingType === type && !inviteProcessed && !isJoining) {
      handleJoin();
    }
  }, [user, inviteCode, type, inviteProcessed, isJoining]);

  return {
    entity,
    isLoading: isLoadingEntity,
    error: entityError ? (entityError as Error).message : error,
    isJoining,
    successMessage,
    handleJoin,
    user
  };
}
