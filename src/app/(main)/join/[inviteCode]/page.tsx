import JoinPageContent from '@/components/auth/JoinPageContent/JoinPageContent';

export default async function JoinTeamPage({
  params,
}: {
  params: Promise<{ inviteCode: string }>;
}) {
  const { inviteCode } = await params;
  return <JoinPageContent inviteCode={inviteCode} type="team" />;
}
