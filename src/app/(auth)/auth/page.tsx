'use client';

import { useState, useEffect, Suspense } from 'react';
import Link from 'next/link';
import { useRouter, useSearchParams } from 'next/navigation';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm, type ControllerRenderProps, type FieldPath } from 'react-hook-form';
import { useAuth } from '@/contexts/AuthContext';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/forms';
import { Checkbox, Select } from '@/components/ui/forms';
import {
  registrationSectorOptions,
  referralSourceOptions,
  birthYearOptions,
  birthMonthOptions,
  birthDayOptions,
  churchDenominationOptions,
  municipalities,
} from '@/data';
import styles from './page.module.scss';

const loginSchema = z.object({
  email: z.string().email('Vul een geldig e-mailadres in'),
  password: z.string().min(6, 'Wachtwoord moet ten minste 6 tekens bevatten'),
});

const forgotPasswordSchema = z.object({
  email: z.string().email('Vul een geldig e-mailadres in'),
});

const verifyAccountSchema = z.object({
  email: z.string().email('Vul een geldig e-mailadres in'),
});

const resetPasswordSchema = z.object({
  password: z.string().min(6, 'Wachtwoord moet ten minste 6 tekens bevatten'),
});

const registerSchema = z
  .object({
    firstName: z.string().min(2, 'Voornaam moet ten minste 2 tekens bevatten'),
    lastName: z.string().min(2, 'Achternaam moet ten minste 2 tekens bevatten'),
    email: z.string().email('Ongeldig e-mailadres'),
    password: z.string().min(6, 'Wachtwoord moet ten minste 6 tekens bevatten'),
    birthYear: z.string().optional(),
    birthMonth: z.string().optional(),
    birthDay: z.string().optional(),
    currentSector: z.string().min(1, 'Huidige sector is verplicht'),
    preferredSector: z.string().min(1, 'Voorkeurssector is verplicht'),
    referralSource: z.string().optional().nullable(),
    isTeamLeader: z.boolean().default(false),
    denomination: z.string().optional(),
    churchName: z.string().optional(),
    churchLocation: z.string().optional(),
    inviteCode: z.string().optional(),
    acceptTerms: z.boolean().refine((val) => val === true, {
      message: 'Je moet akkoord gaan met de algemene voorwaarden en het privacybeleid',
    }),
  })
  .superRefine((data, ctx) => {
    if (data.isTeamLeader) {
      if (!data.denomination?.trim()) {
        ctx.addIssue({ path: ['denomination'], code: z.ZodIssueCode.custom, message: 'Denominatie is verplicht wanneer je teamleider bent' });
      }
      if (!data.churchName?.trim()) {
        ctx.addIssue({ path: ['churchName'], code: z.ZodIssueCode.custom, message: 'Kerknaam is verplicht wanneer je teamleider bent' });
      }
      if (!data.churchLocation?.trim()) {
        ctx.addIssue({ path: ['churchLocation'], code: z.ZodIssueCode.custom, message: 'Kerk locatie is verplicht wanneer je teamleider bent' });
      }
    }
  });

type LoginFormValues = z.infer<typeof loginSchema>;
type RegisterFormValues = z.infer<typeof registerSchema>;

type FieldProps<T extends Record<string, unknown>> = { field: ControllerRenderProps<T, FieldPath<T>> };

function AuthPageContent() {
  const { user, login, register: doRegister, forgotPassword, resetPassword, verifyEmail, resendVerification } = useAuth();
  const router = useRouter();
  const searchParams = useSearchParams();

  const redirect = searchParams?.get('redirect') ?? '';
  const emailRedirectAddress = searchParams?.get('email') ?? '';
  const emailForgotPassword = searchParams?.get('forgot-password-email') ?? '';
  const resetPasswordToken = searchParams?.get('token') ?? '';
  const urlActiveTab = searchParams?.get('activeTab') ?? '';

  const [activeTab, setActiveTab] = useState(urlActiveTab || 'register');
  const [isTeamLeader, setIsTeamLeader] = useState(false);
  const [hasInviteCode, setHasInviteCode] = useState(false);
  const [verificationCode, setVerificationCode] = useState<string | null>(null);
  const [showSignInPassword, setShowSignInPassword] = useState(false);
  const [showResetPassword, setShowResetPassword] = useState(false);
  const [showSignUpPassword, setShowSignUpPassword] = useState(false);
  const [loginPending, setLoginPending] = useState(false);
  const [registerPending, setRegisterPending] = useState(false);
  const [resendPending, setResendPending] = useState(false);
  const [forgotPending, setForgotPending] = useState(false);
  const [resetPending, setResetPending] = useState(false);

  const loginForm = useForm<LoginFormValues>({
    resolver: zodResolver(loginSchema),
    defaultValues: { email: '', password: '' },
  });

  const forgotPasswordForm = useForm<z.infer<typeof forgotPasswordSchema>>({
    resolver: zodResolver(forgotPasswordSchema),
    defaultValues: { email: '' },
  });

  const verifyAccountForm = useForm<z.infer<typeof verifyAccountSchema>>({
    resolver: zodResolver(verifyAccountSchema),
    defaultValues: { email: '' },
  });

  const resetPasswordForm = useForm<z.infer<typeof resetPasswordSchema>>({
    resolver: zodResolver(resetPasswordSchema),
    defaultValues: { password: '' },
  });

  const registerForm = useForm<RegisterFormValues>({
    resolver: zodResolver(registerSchema),
    defaultValues: {
      firstName: '',
      lastName: '',
      email: '',
      password: '',
      birthYear: '',
      birthMonth: '',
      birthDay: '',
      currentSector: '',
      preferredSector: '',
      referralSource: null,
      isTeamLeader: false,
      denomination: '',
      churchName: '',
      churchLocation: '',
      inviteCode: '',
      acceptTerms: false,
    },
  });

  useEffect(() => {
    if (redirect === 'verify-email' || emailRedirectAddress) setActiveTab('verify-email');
    else if (redirect === 'forgot-password') setActiveTab('forgot-password');
    else if (redirect === 'reset-password' && resetPasswordToken) setActiveTab('reset-password');
    else if (urlActiveTab) setActiveTab(urlActiveTab);
  }, [redirect, emailRedirectAddress, resetPasswordToken, urlActiveTab]);

  useEffect(() => {
    if (emailForgotPassword && activeTab === 'forgot-password') {
      forgotPasswordForm.setValue('email', emailForgotPassword);
    }
  }, [emailForgotPassword, activeTab]);

  useEffect(() => {
    if (redirect?.includes('/join/')) {
      const match = redirect.match(/\/join\/([^/]+)/);
      if (match?.[1]) {
        registerForm.setValue('inviteCode', match[1]);
        setHasInviteCode(true);
        setActiveTab('register');
      }
    }
    const pending = typeof window !== 'undefined' ? localStorage.getItem('pendingInviteCode') : null;
    if (pending && urlActiveTab !== 'login') {
      registerForm.setValue('inviteCode', pending);
      setHasInviteCode(true);
      setActiveTab('register');
    }
  }, [redirect, urlActiveTab]);

  useEffect(() => {
    if (user) {
      const r = searchParams?.get('redirect');
      if (r === 'verify' || r === 'reset-password') return;
      router.replace(searchParams?.get('redirect') || '/dashboard');
    }
  }, [user, router, searchParams]);

  const onLoginSubmit = async (data: LoginFormValues) => {
    setLoginPending(true);
    try {
      await login(data.email, data.password);
    } catch (e) {
      loginForm.setError('root', { message: e instanceof Error ? e.message : 'Inloggen mislukt.' });
    } finally {
      setLoginPending(false);
    }
  };

  const onRegisterSubmit = async (data: RegisterFormValues) => {
    const birthDate =
      data.birthYear && data.birthMonth && data.birthDay
        ? `${data.birthYear}-${String(data.birthMonth).padStart(2, '0')}-${String(data.birthDay).padStart(2, '0')}`
        : undefined;
    const actualIsTeamLeader = hasInviteCode ? false : data.isTeamLeader;
    const payload: Record<string, unknown> = {
      firstName: data.firstName,
      lastName: data.lastName,
      email: data.email,
      password: data.password,
      birthDate,
      currentSector: data.currentSector,
      preferredSector: data.preferredSector,
      referralSource: data.referralSource ?? undefined,
      isTeamLeader: actualIsTeamLeader,
      inviteCode: data.inviteCode || undefined,
      acceptTerms: data.acceptTerms,
    };
    if (actualIsTeamLeader) {
      payload.denomination = data.denomination;
      payload.churchName = data.churchName;
      payload.churchLocation = data.churchLocation;
    }
    setRegisterPending(true);
    try {
      await doRegister(payload);
    } catch (e) {
      registerForm.setError('root', { message: e instanceof Error ? e.message : 'Registratie mislukt.' });
    } finally {
      setRegisterPending(false);
    }
  };

  const handleResend = async (formEmail?: string) => {
    const email = emailRedirectAddress || formEmail;
    if (!email?.trim()) return;
    setResendPending(true);
    setVerificationCode(null);
    try {
      const res = await resendVerification(email.trim());
      if (res?.code) setVerificationCode(res.code);
    } finally {
      setResendPending(false);
    }
  };

  const onVerifySubmit = (data: { email: string }) => {
    handleResend(data.email);
  };

  const onForgotSubmit = async (data: { email: string }) => {
    setForgotPending(true);
    try {
      await forgotPassword(data.email);
    } catch (e) {
      forgotPasswordForm.setError('root', { message: e instanceof Error ? e.message : 'Verzenden mislukt.' });
    } finally {
      setForgotPending(false);
    }
  };

  const onResetSubmit = async (data: { password: string }) => {
    if (!resetPasswordToken) return;
    setResetPending(true);
    try {
      await resetPassword(resetPasswordToken, data.password);
    } catch (e) {
      resetPasswordForm.setError('root', { message: e instanceof Error ? e.message : 'Wachtwoord resetten mislukt.' });
    } finally {
      setResetPending(false);
    }
  };

  const handleTeamLeaderChange = (checked: boolean) => {
    setIsTeamLeader(!!checked);
    registerForm.setValue('isTeamLeader', !!checked);
    if (!checked) {
      registerForm.setValue('denomination', '');
      registerForm.setValue('churchName', '');
      registerForm.setValue('churchLocation', '');
    }
  };

  return (
    <div className={styles.authPage}>
      <div className={styles.leftPanel}>
        <div className={styles.card}>
          <Link href="/auth?redirect=verify-email" className={styles.verifyLink}>
            Account verifiëren?
          </Link>
          <div className={styles.cardHeader}>
            <h1 className={styles.cardTitle}>Bedieningenprofiel</h1>
            <p className={styles.cardDescription}>
              {activeTab === 'login' ? 'Log in op je account' : 'Maak een nieuw account aan'}
            </p>
          </div>

          <div className={styles.tabsList}>
            <button
              type="button"
              className={`${styles.tabTrigger} ${activeTab === 'login' ? styles.active : ''}`}
              onClick={() => setActiveTab('login')}
            >
              Inloggen
            </button>
            <button
              type="button"
              className={`${styles.tabTrigger} ${activeTab === 'register' ? styles.active : ''}`}
              onClick={() => setActiveTab('register')}
            >
              Registreren
            </button>
          </div>

          {activeTab === 'login' && (
            <Form {...loginForm}>
              <form onSubmit={loginForm.handleSubmit(onLoginSubmit)} className="space-y-4">
                <FormField
                  control={loginForm.control}
                  name="email"
                  render={({ field }: FieldProps<LoginFormValues>) => (
                    <FormItem>
                      <FormLabel className="text-sm">E-mailadres</FormLabel>
                      <FormControl>
                        <Input type="email" placeholder="Vul je e-mailadres in" {...field} className="h-10" />
                      </FormControl>
                      <FormMessage className="text-xs" />
                    </FormItem>
                  )}
                />
                <FormField
                  control={loginForm.control}
                  name="password"
                  render={({ field }: FieldProps<LoginFormValues>) => (
                    <FormItem>
                      <FormLabel className="text-sm">Wachtwoord</FormLabel>
                      <FormControl>
                        <div className="relative">
                          <Input
                            type={showSignInPassword ? 'text' : 'password'}
                            autoComplete="current-password"
                            placeholder="Vul je wachtwoord in"
                            {...field}
                            className="h-10 pr-10"
                          />
                          <button
                            type="button"
                            onClick={() => setShowSignInPassword((s) => !s)}
                            className="absolute right-2 top-1/2 -translate-y-1/2 text-gray-500"
                            aria-label="Toggle password visibility"
                          >
                            {showSignInPassword ? 'Verbergen' : 'Tonen'}
                          </button>
                        </div>
                      </FormControl>
                      <FormMessage className="text-xs" />
                      <div className="flex justify-end">
                        <Link
                          href={`/auth?redirect=forgot-password&forgot-password-email=${encodeURIComponent(loginForm.watch('email'))}`}
                          className={`text-sm ${styles.formLink}`}
                        >
                          Wachtwoord vergeten?
                        </Link>
                      </div>
                    </FormItem>
                  )}
                />
                {loginForm.formState.errors.root && (
                  <p className={styles.errorText}>{loginForm.formState.errors.root.message}</p>
                )}
                <Button type="submit" variant="secondary" disabled={loginPending} fullWidth>
                  {loginPending ? 'Bezig met inloggen...' : 'Inloggen'}
                </Button>
              </form>
            </Form>
          )}

          {activeTab === 'forgot-password' && (
            <>
              <h3 className={styles.sectionTitle}>Wachtwoord vergeten</h3>
              <p className={styles.sectionDescription}>
                Vul je e-mailadres in en we sturen je een link om je wachtwoord opnieuw in te stellen.
              </p>
              <Form {...forgotPasswordForm}>
                <form onSubmit={forgotPasswordForm.handleSubmit(onForgotSubmit)} className="space-y-4">
                  <FormField
                    control={forgotPasswordForm.control}
                    name="email"
                    render={({ field }: FieldProps<z.infer<typeof forgotPasswordSchema>>) => (
                      <FormItem>
                        <FormLabel className="text-sm">E-mailadres</FormLabel>
                        <FormControl>
                          <Input type="email" placeholder="Vul je e-mailadres in" {...field} className="h-10" />
                        </FormControl>
                        <FormMessage className="text-xs" />
                      </FormItem>
                    )}
                  />
                  {forgotPasswordForm.formState.errors.root && (
                    <p className={styles.errorText}>{forgotPasswordForm.formState.errors.root.message}</p>
                  )}
                  <Button type="submit" variant="primary" disabled={forgotPending} fullWidth>
                    {forgotPending ? 'Bezig...' : 'Wachtwoord resetten'}
                  </Button>
                  <p className={styles.backToLoginWrap}>
                    <button
                      type="button"
                      className={styles.formLink}
                      onClick={() => setActiveTab('login')}
                    >
                      ← Terug naar inloggen
                    </button>
                  </p>
                </form>
              </Form>
            </>
          )}

          {activeTab === 'reset-password' && (
            <>
              <h3 className={styles.sectionTitle}>Wachtwoord opnieuw instellen</h3>
              <Form {...resetPasswordForm}>
                <form onSubmit={resetPasswordForm.handleSubmit(onResetSubmit)} className="space-y-4">
                  <FormField
                    control={resetPasswordForm.control}
                    name="password"
                    render={({ field }: FieldProps<z.infer<typeof resetPasswordSchema>>) => (
                      <FormItem>
                        <FormLabel className="text-sm">Wachtwoord</FormLabel>
                        <FormControl>
                          <div className="relative">
                            <Input
                              type={showResetPassword ? 'text' : 'password'}
                              autoComplete="new-password"
                              placeholder="Vul je wachtwoord in"
                              {...field}
                              className="h-10 pr-10"
                            />
                            <button
                              type="button"
                              onClick={() => setShowResetPassword((s) => !s)}
                              className="absolute right-2 top-1/2 -translate-y-1/2 text-gray-500"
                              aria-label="Toggle password visibility"
                            >
                              {showResetPassword ? 'Verbergen' : 'Tonen'}
                            </button>
                          </div>
                        </FormControl>
                        <FormMessage className="text-xs" />
                      </FormItem>
                    )}
                  />
                  {resetPasswordForm.formState.errors.root && (
                    <p className={styles.errorText}>{resetPasswordForm.formState.errors.root.message}</p>
                  )}
                  <Button type="submit" variant="primary" disabled={resetPending} fullWidth>
                    {resetPending ? 'Bezig...' : 'Indienen'}
                  </Button>
                </form>
              </Form>
            </>
          )}

          {activeTab === 'verify-email' && (
            <div className={styles.verifyBox}>
              {emailRedirectAddress ? (
                <>
                  <h2 className="font-medium mb-2">Controleer je inbox</h2>
                  <p className="text-sm text-gray-700 mb-4">
                    Er is een verificatielink naar je e-mailadres gestuurd. Controleer je mailbox.
                  </p>
                  <button
                    type="button"
                    onClick={() => handleResend()}
                    disabled={resendPending}
                    className={styles.resendLink}
                  >
                    {resendPending ? 'Bezig met verzenden...' : 'Verificatielink opnieuw verzenden'}
                  </button>
                  {verificationCode && (
                    <p className={styles.tokenLink}>
                      Verificatielink is verzonden! Klik{' '}
                      <Link href={`/verify-account?token=${encodeURIComponent(verificationCode)}`} target="_blank">
                        hier
                      </Link>{' '}
                      als je de link niet hebt ontvangen.
                    </p>
                  )}
                </>
              ) : (
                <>
                  <h3 className={styles.sectionTitle}>Account verifiëren</h3>
                  <Form {...verifyAccountForm}>
                    <form onSubmit={verifyAccountForm.handleSubmit(onVerifySubmit)} className="space-y-4">
                      <FormField
                        control={verifyAccountForm.control}
                        name="email"
                        render={({ field }: FieldProps<z.infer<typeof verifyAccountSchema>>) => (
                          <FormItem>
                            <FormLabel className="text-sm">E-mailadres</FormLabel>
                            <FormControl>
                              <Input type="email" placeholder="Vul je e-mailadres in" {...field} className="h-10" />
                            </FormControl>
                            <FormMessage className="text-xs" />
                          </FormItem>
                        )}
                      />
                      <Button type="submit" variant="primary" disabled={resendPending} fullWidth>
                        {resendPending ? 'Bezig...' : 'Verificatielink opnieuw verzenden'}
                      </Button>
                      {verificationCode && (
                        <p className={styles.tokenLink}>
                          Klik{' '}
                          <Link href={`/verify-account?token=${encodeURIComponent(verificationCode)}`} target="_blank">
                            hier
                          </Link>{' '}
                          om te verifiëren.
                        </p>
                      )}
                    </form>
                  </Form>
                </>
              )}
            </div>
          )}

          {activeTab === 'register' && (
            <Form {...registerForm}>
              <form onSubmit={registerForm.handleSubmit(onRegisterSubmit)} className="space-y-4">
                {!hasInviteCode ? (
                  <FormField
                    control={registerForm.control}
                    name="isTeamLeader"
                    render={({ field }: FieldProps<RegisterFormValues>) => (
                      <FormItem className={styles.borderBlock}>
                        <div className="flex flex-row items-start space-x-3 space-y-0">
                          <FormControl>
                            <Checkbox
                              id="isTeamLeader"
                              checked={field.value === true}
                              onChange={(e) => {
                                const checked = e.target.checked;
                                field.onChange(checked);
                                handleTeamLeaderChange(checked);
                              }}
                              label="Ik ben gemachtigd om namens deze kerk of bediening dit account aan te maken"
                            />
                          </FormControl>
                        </div>
                      </FormItem>
                    )}
                  />
                ) : (
                  <div className={styles.inviteNotice}>
                    <p className="text-sm text-gray-700">
                      Je registreert met een teamuitnodiging. Je wordt automatisch toegevoegd als teamlid.
                    </p>
                  </div>
                )}

                {isTeamLeader && (
                  <div className={styles.borderBlock}>
                    <h3 className="font-medium mb-3">Gegevens kerk/bediening</h3>
                    <FormField
                      control={registerForm.control}
                      name="churchName"
                      render={({ field }: FieldProps<RegisterFormValues>) => (
                        <FormItem>
                          <FormLabel>Naam van de kerk/bediening</FormLabel>
                          <FormControl>
                            <Input
                              placeholder="Naam van de kerk/bediening"
                              value={typeof field.value === 'string' ? field.value : ''}
                              onChange={field.onChange}
                              onBlur={field.onBlur}
                              name={field.name}
                              ref={field.ref}
                              className="h-10"
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={registerForm.control}
                      name="churchLocation"
                      render={({ field }: FieldProps<RegisterFormValues>) => (
                        <FormItem>
                          <FormLabel>Locatie van de kerk</FormLabel>
                          <FormControl>
                            <Select
                              id="churchLocation"
                              value={typeof field.value === 'string' ? field.value : ''}
                              onChange={field.onChange}
                              options={municipalities}
                              placeholder="Stad/plaats van de kerk"
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={registerForm.control}
                      name="denomination"
                      render={({ field }: FieldProps<RegisterFormValues>) => (
                        <FormItem>
                          <FormLabel>Denominatie</FormLabel>
                          <FormControl>
                            <Select
                              id="denomination"
                              value={typeof field.value === 'string' ? field.value : ''}
                              onChange={field.onChange}
                              options={churchDenominationOptions}
                              placeholder="Selecteer denominatie"
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>
                )}

                <div className={styles.formRow}>
                  <FormField
                    control={registerForm.control}
                    name="firstName"
                    render={({ field }: FieldProps<RegisterFormValues>) => (
                      <FormItem>
                        <FormLabel className="text-sm">Voornaam</FormLabel>
                        <FormControl>
                          <Input
                            placeholder="Voornaam"
                            value={typeof field.value === 'string' ? field.value : ''}
                            onChange={field.onChange}
                            onBlur={field.onBlur}
                            name={field.name}
                            ref={field.ref}
                            className="h-10"
                          />
                        </FormControl>
                        <FormMessage className="text-xs" />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={registerForm.control}
                    name="lastName"
                    render={({ field }: FieldProps<RegisterFormValues>) => (
                      <FormItem>
                        <FormLabel className="text-sm">Achternaam</FormLabel>
                        <FormControl>
                          <Input
                            placeholder="Achternaam"
                            value={typeof field.value === 'string' ? field.value : ''}
                            onChange={field.onChange}
                            onBlur={field.onBlur}
                            name={field.name}
                            ref={field.ref}
                            className="h-10"
                          />
                        </FormControl>
                        <FormMessage className="text-xs" />
                      </FormItem>
                    )}
                  />
                </div>

                <FormField
                  control={registerForm.control}
                  name="email"
                  render={({ field }: FieldProps<RegisterFormValues>) => (
                    <FormItem>
                      <FormLabel className="text-sm">E-mailadres</FormLabel>
                      <FormControl>
                        <Input
                          type="email"
                          placeholder="E-mailadres"
                          value={typeof field.value === 'string' ? field.value : ''}
                          onChange={field.onChange}
                          onBlur={field.onBlur}
                          name={field.name}
                          ref={field.ref}
                          className="h-10"
                        />
                      </FormControl>
                      <FormMessage className="text-xs" />
                    </FormItem>
                  )}
                />

                <FormField
                  control={registerForm.control}
                  name="password"
                  render={({ field }: FieldProps<RegisterFormValues>) => (
                    <FormItem>
                      <FormLabel className="text-sm">Wachtwoord</FormLabel>
                      <FormControl>
                        <div className="relative">
                          <Input
                            type={showSignUpPassword ? 'text' : 'password'}
                            autoComplete="new-password"
                            placeholder="Wachtwoord"
                            value={typeof field.value === 'string' ? field.value : ''}
                            onChange={field.onChange}
                            onBlur={field.onBlur}
                            name={field.name}
                            ref={field.ref}
                            className="h-10 pr-10"
                          />
                          <button
                            type="button"
                            onClick={() => setShowSignUpPassword((s) => !s)}
                            className="absolute right-2 top-1/2 -translate-y-1/2 text-gray-500"
                            aria-label="Toggle password visibility"
                          >
                            {showSignUpPassword ? 'Verbergen' : 'Tonen'}
                          </button>
                        </div>
                      </FormControl>
                      <FormMessage className="text-xs" />
                    </FormItem>
                  )}
                />

                <h2 className={styles.sectionTitle}>Persoonlijke gegevens</h2>

                <FormItem>
                  <FormLabel className="text-sm">Geboortedatum</FormLabel>
                  <div className={styles.formRowThree}>
                    <FormField
                      control={registerForm.control}
                      name="birthYear"
                      render={({ field }: FieldProps<RegisterFormValues>) => (
                        <FormItem>
                          <FormControl>
                            <Select
                              id="birthYear"
                              value={typeof field.value === 'string' ? field.value : ''}
                              onChange={field.onChange}
                              options={birthYearOptions}
                              placeholder="Jaar"
                            />
                          </FormControl>
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={registerForm.control}
                      name="birthMonth"
                      render={({ field }: FieldProps<RegisterFormValues>) => (
                        <FormItem>
                          <FormControl>
                            <Select
                              id="birthMonth"
                              value={typeof field.value === 'string' ? field.value : ''}
                              onChange={field.onChange}
                              options={birthMonthOptions}
                              placeholder="Maand"
                            />
                          </FormControl>
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={registerForm.control}
                      name="birthDay"
                      render={({ field }: FieldProps<RegisterFormValues>) => (
                        <FormItem>
                          <FormControl>
                            <Select
                              id="birthDay"
                              value={typeof field.value === 'string' ? field.value : ''}
                              onChange={field.onChange}
                              options={birthDayOptions}
                              placeholder="Dag"
                            />
                          </FormControl>
                        </FormItem>
                      )}
                    />
                  </div>
                </FormItem>

                <div className={styles.formRow}>
                  <FormField
                    control={registerForm.control}
                    name="currentSector"
                    render={({ field }: FieldProps<RegisterFormValues>) => (
                      <FormItem>
                        <FormLabel className="text-sm">Waar ben je werkzaam in de maatschappij?</FormLabel>
                        <FormControl>
                          <Select
                            id="currentSector"
                            value={typeof field.value === 'string' ? field.value : ''}
                            onChange={field.onChange}
                            options={[{ value: '', label: 'Selecteer sector' }, ...registrationSectorOptions]}
                            placeholder="Selecteer sector"
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={registerForm.control}
                    name="preferredSector"
                    render={({ field }: FieldProps<RegisterFormValues>) => (
                      <FormItem>
                        <FormLabel>Waar zou je werkzaam willen zijn in de maatschappij?</FormLabel>
                        <FormControl>
                          <Select
                            id="preferredSector"
                            value={typeof field.value === 'string' ? field.value : ''}
                            onChange={field.onChange}
                            options={[{ value: '', label: 'Selecteer sector' }, ...registrationSectorOptions]}
                            placeholder="Selecteer sector"
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>

                <FormField
                  control={registerForm.control}
                  name="referralSource"
                  render={({ field }: FieldProps<RegisterFormValues>) => (
                    <FormItem>
                      <FormLabel>Hoe ken je ons?</FormLabel>
                      <FormControl>
                        <Select
                          id="referralSource"
                          value={typeof field.value === 'string' ? field.value : ''}
                          onChange={field.onChange}
                          options={[{ value: '', label: 'Hoe heeft u ons gevonden?' }, ...referralSourceOptions]}
                          placeholder="Hoe heeft u ons gevonden?"
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={registerForm.control}
                  name="inviteCode"
                  render={({ field }: FieldProps<RegisterFormValues>) => (
                    <FormItem>
                      <FormLabel>{hasInviteCode ? 'Team Uitnodigingscode' : 'Uitnodigingscode (optioneel)'}</FormLabel>
                      <FormControl>
                        <Input
                          placeholder={hasInviteCode ? 'Je registreert met een teamuitnodiging' : 'Vul een uitnodigingscode in'}
                          value={typeof field.value === 'string' ? field.value : ''}
                          onChange={field.onChange}
                          onBlur={field.onBlur}
                          name={field.name}
                          ref={field.ref}
                          readOnly={hasInviteCode}
                          className={hasInviteCode ? 'bg-gray-100' : ''}
                        />
                      </FormControl>
                      {hasInviteCode && (
                        <p className="text-xs text-gray-600 mt-1">Je wordt automatisch lid van het team na registratie</p>
                      )}
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={registerForm.control}
                  name="acceptTerms"
                  render={({ field }: FieldProps<RegisterFormValues>) => (
                    <FormItem className="flex flex-row items-start space-x-3 space-y-0 p-2">
                      <FormControl>
                        <Checkbox
                          id="acceptTerms"
                          checked={field.value === true}
                          onChange={(e) => field.onChange(e.target.checked)}
                          label="Ik ga akkoord met de algemene voorwaarden en het privacybeleid."
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <p className="text-xs text-gray-600 -mt-2">
                  <Link href="/algemene-voorwaarden" className={styles.formLink} target="_blank">
                    Algemene Voorwaarden
                  </Link>
                  {' · '}
                  <Link href="/privacy" className={styles.formLink} target="_blank">
                    Privacybeleid
                  </Link>
                </p>

                {registerForm.formState.errors.root && (
                  <p className={styles.errorText}>{registerForm.formState.errors.root.message}</p>
                )}
                <Button type="submit" variant="primary" disabled={registerPending} fullWidth>
                  {registerPending ? 'Bezig met registreren...' : 'Registreren'}
                </Button>
              </form>
            </Form>
          )}

          <div className={styles.cardFooter}>
            {activeTab === 'login' ? (
              <>
                Nog geen account?{' '}
                <button type="button" className={styles.footerLink} onClick={() => setActiveTab('register')}>
                  Registreer hier
                </button>
              </>
            ) : (
              <>
                Heb je al een account?{' '}
                <button type="button" className={styles.footerLink} onClick={() => setActiveTab('login')}>
                  Log hier in
                </button>
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default function AuthPage() {
  return (
    <Suspense fallback={<div className="min-h-screen flex items-center justify-center">Laden...</div>}>
      <AuthPageContent />
    </Suspense>
  );
}
