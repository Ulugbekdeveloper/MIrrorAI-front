import { Ionicons } from '@expo/vector-icons';
import { zodResolver } from '@hookform/resolvers/zod';
import { Link, useRouter } from 'expo-router';
import { useState } from 'react';
import { Controller, useForm } from 'react-hook-form';
import {
  KeyboardAvoidingView,
  Platform,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from 'react-native';

import { ApiError } from '@/api';
import { SocialAuthButtons } from '@/features/auth/components/SocialAuthButtons';
import { loginSchema, type LoginInput } from '@/features/auth/schemas';
import { useAuthStore } from '@/stores/authStore';
import { colors, spacing, typography } from '@/theme';
import { Button, ScreenContainer, TextField } from '@/ui';

export default function LoginScreen() {
  const router = useRouter();
  const login = useAuthStore((s) => s.login);
  const [submitError, setSubmitError] = useState<string | null>(null);
  const [passwordVisible, setPasswordVisible] = useState(false);

  const { control, handleSubmit, formState } = useForm<LoginInput>({
    resolver: zodResolver(loginSchema),
    defaultValues: { email: '', password: '' },
  });

  const onSubmit = handleSubmit(async (values) => {
    setSubmitError(null);
    try {
      await login(values.email, values.password);
      router.replace('/(app)/home');
    } catch (err) {
      setSubmitError(
        err instanceof ApiError ? err.message : 'Something went wrong. Try again.',
      );
    }
  });

  return (
    <ScreenContainer>
      <KeyboardAvoidingView
        style={styles.flex}
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      >
        <ScrollView
          contentContainerStyle={styles.scroll}
          keyboardShouldPersistTaps="handled"
          showsVerticalScrollIndicator={false}
        >
          <View style={styles.top}>
            <View style={styles.header}>
              <Text style={styles.title}>
                Welcome back<Text style={styles.wave}>👋</Text>
              </Text>
              <Text style={styles.subtitle}>
                Log in to see what&apos;s happening near you
              </Text>
            </View>

            <View style={styles.form}>
              <Controller
                control={control}
                name="email"
                render={({ field, fieldState }) => (
                  <TextField
                    placeholder="jarik@gmail.com"
                    autoCapitalize="none"
                    autoComplete="email"
                    keyboardType="email-address"
                    textContentType="emailAddress"
                    value={field.value}
                    onChangeText={field.onChange}
                    onBlur={field.onBlur}
                    error={fieldState.error?.message}
                    leftIcon={
                      <Ionicons name="mail-outline" size={20} color={colors.textMuted} />
                    }
                  />
                )}
              />

              <Controller
                control={control}
                name="password"
                render={({ field, fieldState }) => (
                  <TextField
                    placeholder="••••••••••"
                    secureTextEntry={!passwordVisible}
                    autoComplete="password"
                    textContentType="password"
                    value={field.value}
                    onChangeText={field.onChange}
                    onBlur={field.onBlur}
                    error={fieldState.error?.message}
                    leftIcon={
                      <Ionicons
                        name="lock-closed-outline"
                        size={20}
                        color={colors.textMuted}
                      />
                    }
                    rightAdornment={
                      <Pressable
                        onPress={() => setPasswordVisible((v) => !v)}
                        hitSlop={12}
                      >
                        <Ionicons
                          name={passwordVisible ? 'eye-outline' : 'eye-off-outline'}
                          size={20}
                          color={colors.textMuted}
                        />
                      </Pressable>
                    }
                  />
                )}
              />

              <View style={styles.forgotRow}>
                <Text style={styles.forgot}>Forgot Password</Text>
              </View>

              {submitError ? (
                <Text style={styles.errorBanner}>{submitError}</Text>
              ) : null}

              <Button
                label="Log In"
                variant="cta"
                onPress={onSubmit}
                loading={formState.isSubmitting}
              />
            </View>

            <View style={styles.social}>
              <Text style={styles.orText}>or continue with</Text>
              <SocialAuthButtons onError={setSubmitError} />
            </View>
          </View>

          <View style={styles.footer}>
            <Text style={styles.footerText}>Don&apos;t have an account? </Text>
            <Link href="/(auth)/register" style={styles.link}>
              Sign up
            </Link>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </ScreenContainer>
  );
}

const styles = StyleSheet.create({
  flex: { flex: 1 },
  scroll: {
    flexGrow: 1,
    justifyContent: 'space-between',
    paddingTop: spacing.md,
    paddingBottom: spacing.lg,
  },
  top: { gap: spacing.xl },
  header: { gap: spacing.xs, paddingTop: spacing.lg },
  title: { ...typography.displayLg, color: colors.text, letterSpacing: -0.5 },
  wave: { fontSize: 28 },
  subtitle: { ...typography.body, color: colors.textMuted },
  form: { gap: spacing.md },
  forgotRow: { alignItems: 'flex-end', marginTop: -spacing.xxs },
  forgot: {
    ...typography.caption,
    color: colors.textMuted,
    fontWeight: '500',
  },
  errorBanner: {
    ...typography.caption,
    color: colors.danger,
    textAlign: 'center',
  },
  social: { gap: spacing.md, alignItems: 'stretch' },
  orText: {
    ...typography.caption,
    color: colors.textMuted,
    textAlign: 'center',
  },
  footer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    paddingTop: spacing.lg,
  },
  footerText: { ...typography.body, color: colors.textMuted },
  link: { ...typography.bodyStrong, color: colors.text },
});
